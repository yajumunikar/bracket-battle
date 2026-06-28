-- V13__add_fifa_rankings_and_prediction_results.sql

ALTER TABLE arena_intel_matches
    ADD COLUMN IF NOT EXISTS team1_fifa_ranking INTEGER,
    ADD COLUMN IF NOT EXISTS team2_fifa_ranking INTEGER;