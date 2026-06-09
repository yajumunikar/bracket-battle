# BracketBattle 🎮

A full-stack gaming tournament management platform built for the US gaming community. Players can register for tournaments, organizers can manage brackets, and everyone can compete.

**Live:** [thebracketbattle.com](https://thebracketbattle.com) _(deploying soon)_  
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

### Frontend

| Technology            | Purpose                          |
| --------------------- | -------------------------------- |
| React 18 + TypeScript | UI framework                     |
| Material UI (MUI) v5  | Component library                |
| React Router v6       | Client-side routing              |
| Axios                 | HTTP client with JWT interceptor |
| Vite                  | Build tool                       |

### Infrastructure

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Docker     | Redis containerization    |
| Redis      | (Planned) Session caching |
| Railway    | Backend hosting           |
| Vercel     | Frontend hosting          |

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
│           └── bracket/             # Bracket generation, match reporting
└── frontend/                         # React + TypeScript SPA
    └── src/
        ├── api/                      # Axios service layer
        ├── components/               # Navbar, GameCarousel, BracketTree
        ├── context/                  # AuthContext with JWT interceptor
        └── pages/                    # Landing, Tournaments, Bracket, Profile...
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
```

### Games

```
GET /api/v1/games    List all supported games
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

---

## Local Development

### Prerequisites

- Java 21
- Node.js 20+
- PostgreSQL 15+
- Docker (for Redis)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/yajumunikar/bracket-battle.git
cd bracket-battle/backend

# Create PostgreSQL database
createdb bracketbattle

# Update application.yml with your DB credentials
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

**Backend (application.yml):**

```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/bracketbattle
spring.datasource.username: your_db_user
spring.datasource.password: your_db_password
jwt.secret: your_jwt_secret
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Roadmap

- [ ] Deploy to production (thebracketbattle.com)
- [ ] Double elimination bracket support
- [ ] Round Robin format
- [ ] Real-time bracket updates via WebSocket
- [ ] Team tournaments (2v2, 5v5)
- [ ] Tournament chat / announcements
- [ ] Player seeding / rankings
- [ ] OAuth login (Google, Discord)
- [ ] Mobile responsive polish

---

## Author

Built by **Yaju Munikar**  
[thebracketbattle.com](https://thebracketbattle.com) · [GitHub](https://github.com/yajumunikar)
