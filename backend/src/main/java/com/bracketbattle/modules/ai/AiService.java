package com.bracketbattle.modules.ai;

import com.bracketbattle.modules.game.entity.Game;
import com.bracketbattle.modules.game.repository.GameRepository;
import com.bracketbattle.modules.tournament.entity.Tournament;
import com.bracketbattle.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.api-url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final GameRepository gameRepository;
    private final TournamentRepository tournamentRepository;
    private final RestTemplate restTemplate;

    public String chat(List<ChatRequest.Message> messages) {
        String systemPrompt = buildSystemPrompt();

        List<Map<String, String>> groqMessages = new java.util.ArrayList<>();
        groqMessages.add(Map.of("role", "system", "content", systemPrompt));
        for (ChatRequest.Message msg : messages) {
            groqMessages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }

        Map<String, Object> requestBody = Map.of(
            "model", groqModel,
            "messages", groqMessages,
            "max_tokens", 500,
            "temperature", 0.7
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                groqApiUrl, HttpMethod.POST, entity, Map.class
            );

            Map body = response.getBody();
            List choices = (List) body.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            System.err.println("Groq API error: " + e.getMessage());
            e.printStackTrace();
            return "Sorry, I'm having trouble connecting right now. Please try again later.";
        }
    }

    private String buildSystemPrompt() {
        List<Game> games = gameRepository.findAll();
        List<Tournament> openTournaments = tournamentRepository
                .findByFilters(
                        Tournament.Status.OPEN,
                        null,
                        org.springframework.data.domain.PageRequest.of(0, 20)
                ).getContent();

        String gamesList = games.stream()
            .map(g -> "- " + g.getName() + " (" + g.getPlatform() + ")")
            .collect(Collectors.joining("\n"));

        String tournamentsList = openTournaments.isEmpty()
            ? "No open tournaments at the moment."
            : openTournaments.stream()
                .map(t -> String.format(
                    "- %s | Game: %s | Format: %s | Spots left: %d/%d | Entry fee: $%.0f | Prize: %s",
                    t.getTitle(),
                    t.getGame().getName(),
                    t.getFormat(),
                    t.getMaxParticipants() - t.getCurrentParticipants(),
                    t.getMaxParticipants(),
                    t.getEntryFee() != null ? t.getEntryFee() : 0,
                    t.getPrizePool() != null ? "$" + t.getPrizePool() : "None"
                ))
                .collect(Collectors.joining("\n"));

        return """
            You are the BracketBattle Arena Assistant — a helpful, energetic gaming companion for BracketBattle.com, a tournament management platform for the US gaming community.
            
            Your personality: friendly, enthusiastic about gaming, concise, and helpful. Keep responses short (2-4 sentences max) unless the user asks for details.
            
            What you can help with:
            - Finding and recommending tournaments
            - Explaining how BracketBattle works
            - Answering questions about tournament formats (single elimination, double elimination, round robin)
            - Giving information about supported games
            - Helping players decide which tournament to join
            
            What you cannot do:
            - Register users for tournaments (tell them to click the Register button on the tournament page)
            - Create tournaments (tell them to click Host Tournament)
            - Access user account details
            
            CURRENT PLATFORM DATA (use this to answer questions accurately):
            
            Supported games:
            %s
            
            Open tournaments right now:
            %s
            
            How BracketBattle works:
            1. Organizers create tournaments and set format, rules, and prizes
            2. Players register while spots are open
            3. Organizer locks registrations and generates the bracket
            4. Players compete and organizer reports match results
            5. Bracket advances until a winner is crowned
            
            Always be accurate about tournament data. If asked about something you don't know, say so honestly.
            """.formatted(gamesList, tournamentsList);
    }
}