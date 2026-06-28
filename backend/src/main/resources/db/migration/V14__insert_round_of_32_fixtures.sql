-- V14__insert_round_of_32_fixtures.sql
-- Manually inserted Round of 32 fixtures for World Cup 2026
-- Source: CBS Sports confirmed bracket as of June 28, 2026
-- NOTE: Kickoff times are placeholders (3:00 PM local) — update with official times once announced

INSERT INTO arena_intel_matches
    (team1, team2, team1_flag, team2_flag, competition, match_date, venue, group_name, stage, status)
VALUES
    ('South Africa', 'Canada', '🇿🇦', '🇨🇦', 'FIFA World Cup 2026', '2026-06-28 15:00:00', 'SoFi Stadium, Inglewood', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Brazil', 'Japan', '🇧🇷', '🇯🇵', 'FIFA World Cup 2026', '2026-06-29 12:00:00', 'NRG Stadium, Houston', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Germany', 'Paraguay', '🇩🇪', '🇵🇾', 'FIFA World Cup 2026', '2026-06-29 15:00:00', 'Gillette Stadium, Foxborough', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Netherlands', 'Morocco', '🇳🇱', '🇲🇦', 'FIFA World Cup 2026', '2026-06-29 18:00:00', 'Estadio Monterrey, Monterrey', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Ivory Coast', 'Norway', '🇨🇮', '🇳🇴', 'FIFA World Cup 2026', '2026-06-30 12:00:00', 'AT&T Stadium, Arlington', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('France', 'Sweden', '🇫🇷', '🇸🇪', 'FIFA World Cup 2026', '2026-06-30 15:00:00', 'MetLife Stadium, East Rutherford', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Mexico', 'Ecuador', '🇲🇽', '🇪🇨', 'FIFA World Cup 2026', '2026-06-30 18:00:00', 'Estadio Azteca, Mexico City', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('England', 'DR Congo', '🏴', '🇨🇩', 'FIFA World Cup 2026', '2026-07-01 12:00:00', 'Mercedes-Benz Stadium, Atlanta', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Belgium', 'Senegal', '🇧🇪', '🇸🇳', 'FIFA World Cup 2026', '2026-07-01 15:00:00', 'Lumen Field, Seattle', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('United States', 'Bosnia and Herzegovina', '🇺🇸', '🇧🇦', 'FIFA World Cup 2026', '2026-07-01 20:00:00', 'Levi''s Stadium, Santa Clara', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Spain', 'Austria', '🇪🇸', '🇦🇹', 'FIFA World Cup 2026', '2026-07-02 12:00:00', 'SoFi Stadium, Inglewood', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Switzerland', 'Algeria', '🇨🇭', '🇩🇿', 'FIFA World Cup 2026', '2026-07-02 15:00:00', 'BC Place, Vancouver', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Portugal', 'Croatia', '🇵🇹', '🇭🇷', 'FIFA World Cup 2026', '2026-07-02 18:00:00', 'BMO Field, Toronto', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Australia', 'Egypt', '🇦🇺', '🇪🇬', 'FIFA World Cup 2026', '2026-07-03 12:00:00', 'AT&T Stadium, Arlington', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Argentina', 'Cabo Verde', '🇦🇷', '🇨🇻', 'FIFA World Cup 2026', '2026-07-03 15:00:00', 'Hard Rock Stadium, Miami Gardens', NULL, 'ROUND_OF_32', 'SCHEDULED'),
    ('Colombia', 'Ghana', '🇨🇴', '🇬🇭', 'FIFA World Cup 2026', '2026-07-03 18:00:00', 'Arrowhead Stadium, Kansas City', NULL, 'ROUND_OF_32', 'SCHEDULED');