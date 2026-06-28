-- V12__create_prediction_results.sql
-- Tracks prediction accuracy over time for continuous model improvement

CREATE TABLE prediction_results (
    id                  BIGSERIAL PRIMARY KEY,
    match_id            BIGINT NOT NULL REFERENCES arena_intel_matches(id),
    prediction_type     VARCHAR(50) NOT NULL,
    predicted_value     VARCHAR(100) NOT NULL,
    actual_value        VARCHAR(100),
    confidence_percent  DECIMAL(5,2),
    correct             BOOLEAN,
    model_version       VARCHAR(20) DEFAULT 'v1-dixon-coles',
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at         TIMESTAMP
);

CREATE INDEX idx_prediction_results_match_id ON prediction_results(match_id);
CREATE INDEX idx_prediction_results_type ON prediction_results(prediction_type);
CREATE INDEX idx_prediction_results_correct ON prediction_results(correct);