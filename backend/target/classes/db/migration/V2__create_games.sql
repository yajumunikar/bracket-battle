CREATE TABLE games (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    slug        VARCHAR(100)    NOT NULL UNIQUE,
    logo_url    VARCHAR(500),
    platform    VARCHAR(50),
    active      BOOLEAN         NOT NULL DEFAULT true,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);