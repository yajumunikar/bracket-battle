CREATE TABLE brackets (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id),
    total_rounds INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_tournament_bracket UNIQUE (tournament_id)
);

CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    bracket_id BIGINT NOT NULL REFERENCES brackets(id),
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id),
    round_number INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    player1_id BIGINT REFERENCES users(id),
    player2_id BIGINT REFERENCES users(id),
    winner_id BIGINT REFERENCES users(id),
    player1_score INTEGER,
    player2_score INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    next_match_id BIGINT REFERENCES matches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matches_bracket ON matches(bracket_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_round ON matches(bracket_id, round_number);