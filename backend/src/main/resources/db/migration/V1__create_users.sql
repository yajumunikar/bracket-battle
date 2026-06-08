CREATE TABLE users (
    id                BIGSERIAL       PRIMARY KEY,
    username          VARCHAR(30)     NOT NULL UNIQUE,
    email             VARCHAR(255)    NOT NULL UNIQUE,
    password_hash     VARCHAR(255),
    display_name      VARCHAR(50)     NOT NULL,
    avatar_url        VARCHAR(500),
    role              VARCHAR(20)     NOT NULL DEFAULT 'PLAYER',
    oauth_provider    VARCHAR(20),
    oauth_id          VARCHAR(255),
    email_verified    BOOLEAN         NOT NULL DEFAULT false,
    bio               TEXT,
    banned_at         TIMESTAMP,
    ban_reason        TEXT,
    created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMP,

    CONSTRAINT chk_auth CHECK (
        password_hash IS NOT NULL OR oauth_provider IS NOT NULL
    )
);

CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_username   ON users(username);
CREATE INDEX idx_users_role       ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);