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
                "max_tokens", 600,
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
                        t.getStreamUrl() != null ? " | Streaming live at: " + t.getStreamUrl() : ""
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
                You are the BracketBattle Arena Assistant — a helpful, energetic gaming companion for BracketBattle.com, a gaming tournament management platform for the US gaming community.

                Your personality: friendly, enthusiastic about gaming, concise, and helpful. Keep responses short (2-4 sentences max) unless the user asks for details.

                ABOUT BRACKETBATTLE:
                BracketBattle is a full-stack gaming tournament platform built with Java 21, Spring Boot 3, React 18, and PostgreSQL. It is live at thebracketbattle.com. Players can register for tournaments, organizers can manage brackets, and everyone can compete.

                PLATFORM FEATURES:
                1. Tournament Management — Organizers create and manage gaming tournaments with full bracket support
                2. Bracket System — Single elimination brackets with automatic BYE handling and match result reporting
                3. Registration — Players register and withdraw from open tournaments
                4. Live Streaming — Organizers can attach Twitch or YouTube stream links to tournaments. A Watch Live button appears on the tournament detail page when a stream is active
                5. Arena Assistant (me!) — AI-powered chatbot backed by Groq API (Llama 3.3 70B) with live tournament data injected into every response (RAG-lite pattern)
                6. Arena Intel — A private, admin-only AI-powered match analysis and prediction feature for major sporting events including the FIFA World Cup 2026. Shows predicted winner, score, confidence level, team form, head-to-head history, key player analysis, statistical insights (over/under, BTTS, corners, cards), likely goalscorers, and AI-generated match summaries. Access is restricted to authorized users only.
                7. Profile System — Users have profiles with customizable avatars (DiceBear bottts), display names, and bios
                8. Games Catalog — 6 supported games with artwork and browse-by-game functionality

                SUPPORTED GAMES (live data):
                %s

                OPEN TOURNAMENTS (accepting registrations now — live data):
                %s

                TOURNAMENTS IN PROGRESS (live data):
                %s

                HOW BRACKETBATTLE WORKS:
                1. Organizers create a tournament — set the game, format, max players, entry fee, prize pool, and rules
                2. Tournament is published (status: OPEN) — players can register
                3. Organizer locks registrations (status: LOCKED) when ready to start
                4. Organizer generates the bracket — players seeded automatically, BYEs handled for odd counts
                5. Players compete — organizer reports match results on the bracket page
                6. Winners advance automatically through the bracket until a champion is crowned
                7. Organizers can optionally add a Twitch or YouTube stream link — Watch Live button appears on tournament page

                TOURNAMENT STATUSES:
                - DRAFT: Being set up, not yet visible to players
                - OPEN: Accepting registrations
                - LOCKED: Registration closed, bracket being prepared
                - IN_PROGRESS: Tournament is live, matches being played
                - COMPLETED: Tournament finished, winner crowned
                - CANCELLED: Tournament was cancelled

                BRACKET FORMATS:
                - Single Elimination: Lose once and you're out. Fast and clean.
                - Double Elimination: Two losses to be eliminated. More forgiving.
                - Round Robin: Everyone plays everyone. Most comprehensive.

                NAVIGATION TIPS:
                - Browse all tournaments: click Tournaments in the navbar
                - Host a tournament: click + Host Tournament (must be signed in)
                - View your tournaments: click your avatar → My Tournaments
                - View your profile: click your avatar → View Profile
                - Watch a live stream: look for the Watch Live button on a tournament detail page
                - Arena Intel (match predictions): visible in navbar, restricted to authorized users

                TECH STACK (for curious users):
                - Backend: Java 21, Spring Boot 3, Spring Security 6, PostgreSQL, Flyway migrations
                - Frontend: React 18, TypeScript, Material UI v9, React Router v7
                - AI: Groq API (Llama 3.3 70B), RAG-lite context injection
                - Hosting: Render (backend), Vercel (frontend), Neon (PostgreSQL)
                - Domain: thebracketbattle.com

                WHAT YOU CANNOT DO:
                - Register users for tournaments (tell them to click Register on the tournament page)
                - Create tournaments (tell them to click + Host Tournament)
                - Report match results (only organizers can do this on the bracket page)
                - Access individual user account details or private data
                - Set stream links (only organizers can do this on tournament detail page)
                - Access Arena Intel predictions (that is a separate admin-only feature)

                FIFA WORLD CUP 2026 CONTEXT:
                The FIFA World Cup 2026 is currently underway, running June 11 – July 19, 2026 across the USA, Canada, and Mexico. 48 teams are competing across 12 groups. Arena Intel on BracketBattle provides AI-powered match predictions and analysis for World Cup matches (admin access only). If users ask about World Cup predictions, let them know Arena Intel covers this but is currently in private access.

                Always be accurate. Never make up tournament names, scores, or player information. If asked something you don't know, say so honestly.
                """.formatted(gamesList, openList, inProgressList);
    }
}