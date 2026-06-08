CREATE TABLE tournaments (
    id                      BIGSERIAL       PRIMARY KEY,
    organizer_id            BIGINT          NOT NULL REFERENCES users(id),
    game_id                 BIGINT          NOT NULL REFERENCES games(id),
    title                   VARCHAR(100)    NOT NULL,
    slug                    VARCHAR(120)    NOT NULL UNIQUE,
    description             TEXT,
    format                  VARCHAR(30)     NOT NULL DEFAULT 'SINGLE_ELIMINATION',
    tournament_type         VARCHAR(20)     NOT NULL DEFAULT 'ONE_V_ONE',
    status                  VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    max_participants        INT             NOT NULL,
    current_participants    INT             NOT NULL DEFAULT 0,
    entry_fee               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    prize_description       TEXT,
    banner_url              VARCHAR(500),
    rules                   TEXT,
    registration_closes_at  TIMESTAMP,
    starts_at               TIMESTAMP,
    completed_at            TIMESTAMP,
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMP,
    version                 BIGINT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_tournaments_organizer   ON tournaments(organizer_id);
CREATE INDEX idx_tournaments_game        ON tournaments(game_id);
CREATE INDEX idx_tournaments_status      ON tournaments(status);
CREATE INDEX idx_tournaments_deleted_at  ON tournaments(deleted_at);