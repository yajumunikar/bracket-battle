# BracketBattle 🎮

A full-stack gaming tournament management platform built for the US gaming community. Players can register for tournaments, organizers can manage brackets, and everyone can compete.

**Live:** [thebracketbattle.com](https://thebracketbattle.com)
**Backend:** REST API · Java 21 · Spring Boot 3  
**Frontend:** React · TypeScript · Material UI

---

## Features

**Player**

- Register and authenticate with JWT
- Browse and filter tournaments by game and status
- Register / withdraw from open tournaments
- View live bracket progress and match results
- Public profile with tournament history and stats
- AI-powered Arena Assistant for tournament discovery and platform help

**Organizer**

- Create tournaments with custom format, prize pool, entry fee, and rules
- Publish, lock, and delete tournaments
- Generate single-elimination brackets from registered players (auto-seeded with bye handling)
- Report match results — winner auto-advances through the bracket
- Organizer dashboard with full tournament management

**Platform**

- 6 supported games (EA FC 25, Valorant, Call of Duty, Fortnite, Rocket League, Apex Legends)
- Single elimination bracket algorithm with automatic BYE handling
- Role-based access control (Player, Organizer, Admin)
- Soft deletes, optimistic locking, and Flyway database migrations
- Context-aware AI chatbot with live tournament data injection (RAG-lite pattern)

---

## Tech Stack

### Backend

| Technology                  | Purpose                             |
| --------------------------- | ----------------------------------- |
| Java 21                     | Core language                       |
| Spring Boot 3.2.5           | Application framework               |
| Spring Security 6           | JWT authentication & authorization  |
| Spring Data JPA + Hibernate | ORM and data access                 |
| PostgreSQL                  | Primary database                    |
| Flyway                      | Database migrations                 |
| Lombok                      | Boilerplate reduction               |
| jjwt 0.12.5                 | JWT token generation and validation |
| Groq API (Llama 3.3)        | AI chatbot inference                |

### Frontend

| Technology            | Purpose                          |
| --------------------- | -------------------------------- |
| React 18 + TypeScript | UI framework                     |
| Material UI (MUI) v9  | Component library                |
| React Router v7       | Client-side routing              |
| Axios                 | HTTP client with JWT interceptor |
| Vite                  | Build tool                       |

### Infrastructure

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Render     | Backend hosting         |
| Neon       | PostgreSQL (production) |
| Vercel     | Frontend hosting        |
| Docker     | Redis containerization  |

---

## Architecture

```
bracket-battle/
├── backend/                          # Spring Boot application
│   └── src/main/java/com/bracketbattle/
│       ├── config/                   # Security, CORS, JPA configuration
│       ├── common/                   # ApiResponse wrapper, GlobalExceptionHandler
│       └── modules/
│           ├── auth/                 # JWT auth, login, register
│           ├── user/                 # User entity, profile endpoints
│           ├── game/                 # Game catalog
│           ├── tournament/           # Tournament CRUD, publish, lock
│           ├── registration/         # Player registration, participant tracking
│           ├── bracket/              # Bracket generation, match reporting
│           └── ai/                   # Arena Assistant — Groq integration, RAG-lite context
└── frontend/                         # React + TypeScript SPA
    └── src/
        ├── api/                      # Axios service layer (auth, tournaments, chat)
        ├── components/               # Navbar, GameCarousel, BracketTree, ChatBot
        ├── context/                  # AuthContext with JWT interceptor
        └── pages/                    # Landing, Tournaments, Bracket, Profile...
```

---

## AI Integration

BracketBattle includes a context-aware AI assistant powered by the Groq API (Llama 3.3 70B).

**How it works:**

1. User sends a message via the floating chat bubble
2. Frontend sends the message history to `POST /api/v1/ai/chat`
3. Backend fetches live data from the database — all supported games and currently open tournaments
4. That data is injected into the system prompt alongside platform context
5. The enriched prompt is sent to Groq's inference API
6. The response is returned to the frontend and displayed in the chat UI

This pattern is known as RAG-lite (Retrieval Augmented Generation without a vector database). The AI always has access to real-time tournament data, so answers about open tournaments, available spots, entry fees, and prize pools are always accurate.

**Security:** The Groq API key is stored server-side only as an environment variable. The frontend never has access to it — all AI requests are proxied through the authenticated Spring Boot backend.

**Example interactions:**

- "What Valorant tournaments are open right now?"
- "How does single elimination work?"
- "Are there any free tournaments I can join?"
- "How many spots are left in the Friday Cup?"

**API endpoint:**

```
POST /api/v1/ai/chat     Send a message to the Arena Assistant (public)
```

---

## API Endpoints

### Auth

```
POST /api/v1/auth/register     Create account
POST /api/v1/auth/login        Login and receive JWT
```

### Tournaments

```
GET    /api/v1/tournaments              List all tournaments (filterable)
POST   /api/v1/tournaments             Create tournament (auth required)
GET    /api/v1/tournaments/{id}        Get tournament details
POST   /api/v1/tournaments/{id}/publish   Publish tournament (organizer only)
POST   /api/v1/tournaments/{id}/lock      Lock registrations (organizer only)
DELETE /api/v1/tournaments/{id}           Soft delete (organizer only)
GET    /api/v1/tournaments/my             Get my tournaments (auth required)
```

### Registrations

```
POST   /api/v1/tournaments/{id}/registrations      Register for tournament
DELETE /api/v1/tournaments/{id}/registrations      Withdraw registration
GET    /api/v1/tournaments/{id}/registrations/me   Check registration status
```

### Brackets

```
POST /api/v1/tournaments/{id}/bracket/generate              Generate bracket (organizer only)
GET  /api/v1/tournaments/{id}/bracket                       Get bracket with all matches
POST /api/v1/tournaments/{id}/bracket/matches/{id}/result   Report match result (organizer only)
```

### Users

```
GET /api/v1/users/me            Get own profile (auth required)
GET /api/v1/users/{username}    Get public profile
PUT /api/v1/users/me            Update profile (auth required)
```

### Games

```
GET /api/v1/games    List all supported games
```

### AI

```
POST /api/v1/ai/chat    Send message to Arena Assistant (public)
```

---

## Database Schema

7 Flyway migrations applied in sequence:

```
V1 — users
V2 — games
V3 — seed 6 games
V4 — tournaments
V5 — registrations (unique constraint: one registration per user per tournament)
V6 — prize_pool column on tournaments
V7 — brackets + matches (single elimination bracket engine)
```

---

## Key Technical Decisions

**JWT over sessions** — stateless authentication fits the REST architecture and scales horizontally without shared session state.

**Flyway over Hibernate DDL** — production-safe schema migrations with full version history and rollback capability.

**Soft deletes** — tournaments are never hard-deleted; deleted_at timestamp preserves data integrity and audit history.

**Optimistic locking** — @Version on the Tournament entity prevents concurrent update conflicts during high-traffic registration periods.

**Bracket algorithm** — single elimination brackets are generated by shuffling registered players, computing total rounds as ceil(log2(n)), seeding round 1 matches, and handling odd player counts with automatic BYE advancement. Winners are propagated to the correct next-round match slot automatically.

**RAG-lite AI pattern** — rather than a generic chatbot, the Arena Assistant fetches live tournament and game data from the database on every request and injects it into the LLM system prompt. This ensures accurate, real-time answers without a vector database. The API key is server-side only — never exposed to the client.

---

## Local Development

### Prerequisites

- Java 21
- Node.js 20+
- PostgreSQL 15+
- Docker (optional, for Redis)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/yajumunikar/bracket-battle.git
cd bracket-battle/backend

# Create PostgreSQL database
createdb bracketbattle

# Update application.yml with your DB credentials and Groq API key
# Then run
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

**Backend (application.yml / Render environment):**

```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/bracketbattle
spring.datasource.username: your_db_user
spring.datasource.password: your_db_password
jwt.secret: your_jwt_secret
jwt.access-token-expiry-ms: 86400000
jwt.refresh-token-expiry-ms: 604800000
groq.api-key: your_groq_api_key
groq.api-url: https://api.groq.com/openai/v1/chat/completions
groq.model: llama-3.3-70b-versatile
frontend.url: http://localhost:5173
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Roadmap

- [x] Deploy to production (thebracketbattle.com)
- [x] AI-powered Arena Assistant with live tournament context
- [ ] Token expiry auto-logout and redirect
- [ ] Game filtering on tournaments page
- [ ] Avatar persistence after re-login
- [ ] 404 page
- [ ] View Bracket button on tournament cards
- [ ] Mobile responsive polish
- [ ] Double elimination bracket support
- [ ] Round Robin format
- [ ] Real-time bracket updates via WebSocket
- [ ] Team tournaments (2v2, 5v5)
- [ ] Tournament chat / announcements
- [ ] Player seeding / rankings
- [ ] OAuth login (Google, Discord)

---

## Author

Built by **Yaju Munikar**  
[thebracketbattle.com](https://thebracketbattle.com) · [GitHub](https://github.com/yajumunikar)
