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

        List<Tournament> inProgressTournaments = tournamentRepository
                .findByFilters(
                        Tournament.Status.IN_PROGRESS,
                        null,
                        org.springframework.data.domain.PageRequest.of(0, 10)
                ).getContent();

        String gamesList = games.stream()
                .map(g -> "- " + g.getName() + " (" + g.getPlatform() + ")")
                .collect(Collectors.joining("\n"));

        String openList = openTournaments.isEmpty()
                ? "No open tournaments at the moment."
                : openTournaments.stream()
                .map(t -> String.format(
                        "- %s | Game: %s | Format: %s | Spots left: %d/%d | Entry fee: %s | Prize: %s%s",
                        t.getTitle(),
                        t.getGame().getName(),
                        t.getFormat().name().replace("_", " "),
                        t.getMaxParticipants() - t.getCurrentParticipants(),
                        t.getMaxParticipants(),
                        t.getEntryFee() != null && t.getEntryFee().compareTo(java.math.BigDecimal.ZERO) > 0
                                ? "$" + t.getEntryFee().toPlainString() : "Free",
                        t.getPrizePool() != null ? "$" + t.getPrizePool().toPlainString() : "None",
                        t.getStreamUrl() != null ? " | Stream: " + t.getStreamUrl() : ""
                ))
                .collect(Collectors.joining("\n"));

        String inProgressList = inProgressTournaments.isEmpty()
                ? "No tournaments currently in progress."
                : inProgressTournaments.stream()
                .map(t -> String.format(
                        "- %s | Game: %s | %d players%s",
                        t.getTitle(),
                        t.getGame().getName(),
                        t.getCurrentParticipants(),
                        t.getStreamUrl() != null ? " | Streaming live at: " + t.getStreamUrl() : ""
                ))
                .collect(Collectors.joining("\n"));

        return """
            You are the BracketBattle Arena Assistant — a helpful, energetic gaming companion for BracketBattle.com, a tournament management platform for the US gaming community.

            Your personality: friendly, enthusiastic about gaming, concise, and helpful. Keep responses short (2-4 sentences max) unless the user asks for details.

            What you can help with:
            - Finding and recommending open tournaments to join
            - Telling users about tournaments currently in progress (including stream links if available)
            - Explaining how BracketBattle works
            - Answering questions about tournament formats (single elimination, double elimination, round robin)
            - Giving information about supported games
            - Helping players decide which tournament to join
            - Explaining the bracket system and how matches work
            - Telling users about stream links so they can watch live tournaments

            What you cannot do:
            - Register users for tournaments (tell them to click Register on the tournament page)
            - Create tournaments (tell them to click + Host Tournament in the navbar)
            - Report match results (only organizers can do this on the bracket page)
            - Access individual user account details or private information
            - Set stream links (only organizers can do this on the tournament detail page)

            CURRENT PLATFORM DATA (use this to answer questions accurately):

            Supported games:
            %s

            Open tournaments (accepting registrations now):
            %s

            Tournaments currently in progress:
            %s

            How BracketBattle works:
            1. Organizers create a tournament — set the game, format, max players, entry fee, prize pool, and rules
            2. Tournament is published (status: OPEN) — players can register
            3. Organizer locks registrations (status: LOCKED) when ready to start
            4. Organizer generates the bracket — players are seeded automatically, BYEs handled for odd counts
            5. Players compete — organizer reports match results on the bracket page
            6. Winners advance automatically through the bracket until a champion is crowned
            7. Organizers can optionally add a Twitch or YouTube stream link — a Watch Live button appears on the tournament page

            Tournament statuses explained:
            - DRAFT: Being set up, not yet visible to players
            - OPEN: Accepting registrations
            - LOCKED: Registration closed, bracket being prepared
            - IN_PROGRESS: Tournament is live, matches being played
            - COMPLETED: Tournament finished, winner crowned
            - CANCELLED: Tournament was cancelled

            Bracket formats explained:
            - Single Elimination: Lose once and you're out. Clean and fast.
            - Double Elimination: Two losses to be eliminated. More forgiving.
            - Round Robin: Everyone plays everyone. Most comprehensive.

            Navigation tips:
            - Browse tournaments: click Tournaments in the navbar
            - Host a tournament: click + Host Tournament (must be signed in)
            - View your tournaments: click your avatar → My Tournaments
            - View your profile: click your avatar → View Profile
            - Watch a live tournament: look for the Watch Live button on the tournament detail page

            Always be accurate about tournament data. If asked about something you don't know, say so honestly. Never make up tournament names, scores, or player information.
            """.formatted(gamesList, openList, inProgressList);
    }
}