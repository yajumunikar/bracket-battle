CREATE TABLE arena_intel_matches (
    id BIGSERIAL PRIMARY KEY,
    team1 VARCHAR(100) NOT NULL,
    team2 VARCHAR(100) NOT NULL,
    team1_flag VARCHAR(10),
    team2_flag VARCHAR(10),
    competition VARCHAR(100) DEFAULT 'FIFA World Cup 2026',
    match_date TIMESTAMP NOT NULL,
    venue VARCHAR(200),
    group_name VARCHAR(20),
    stage VARCHAR(50) DEFAULT 'GROUP',
    actual_score VARCHAR(20),
    actual_winner VARCHAR(100),
    status VARCHAR(20) DEFAULT 'SCHEDULED'
);

CREATE TABLE arena_intel_predictions (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT REFERENCES arena_intel_matches(id),
    prediction_json JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    was_correct BOOLEAN,
    accuracy_notes TEXT
);

CREATE TABLE arena_intel_user_picks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    match_id BIGINT REFERENCES arena_intel_matches(id),
    predicted_winner VARCHAR(100),
    predicted_score VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    points_earned INT DEFAULT 0,
    UNIQUE(user_id, match_id)
);