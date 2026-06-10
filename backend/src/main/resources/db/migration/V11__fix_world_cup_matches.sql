-- Clear incorrect seeded data
DELETE FROM arena_intel_predictions;
DELETE FROM arena_intel_matches;

-- Reset sequence
ALTER SEQUENCE arena_intel_matches_id_seq RESTART WITH 1;

-- Group A
INSERT INTO arena_intel_matches (team1, team2, team1_flag, team2_flag, match_date, venue, group_name, stage) VALUES
('Mexico', 'South Africa', '🇲🇽', '🇿🇦', '2026-06-11 15:00:00', 'Estadio Azteca, Mexico City', 'A', 'GROUP'),
('South Korea', 'Czechia', '🇰🇷', '🇨🇿', '2026-06-11 22:00:00', 'Estadio Akron, Zapopan', 'A', 'GROUP'),
('Mexico', 'South Korea', '🇲🇽', '🇰🇷', '2026-06-15 21:00:00', 'Estadio Azteca, Mexico City', 'A', 'GROUP'),
('South Africa', 'Czechia', '🇿🇦', '🇨🇿', '2026-06-15 18:00:00', 'Estadio Akron, Zapopan', 'A', 'GROUP'),
('Mexico', 'Czechia', '🇲🇽', '🇨🇿', '2026-06-19 21:00:00', 'Estadio Akron, Zapopan', 'A', 'GROUP'),
('South Korea', 'South Africa', '🇰🇷', '🇿🇦', '2026-06-19 21:00:00', 'Estadio Azteca, Mexico City', 'A', 'GROUP'),

-- Group B
('Canada', 'Bosnia and Herzegovina', '🇨🇦', '🇧🇦', '2026-06-12 15:00:00', 'BMO Field, Toronto', 'B', 'GROUP'),
('Qatar', 'Switzerland', '🇶🇦', '🇨🇭', '2026-06-12 18:00:00', 'SoFi Stadium, Los Angeles', 'B', 'GROUP'),
('Canada', 'Qatar', '🇨🇦', '🇶🇦', '2026-06-16 15:00:00', 'BC Place, Vancouver', 'B', 'GROUP'),
('Switzerland', 'Bosnia and Herzegovina', '🇨🇭', '🇧🇦', '2026-06-16 18:00:00', 'BMO Field, Toronto', 'B', 'GROUP'),
('Canada', 'Switzerland', '🇨🇦', '🇨🇭', '2026-06-20 21:00:00', 'BC Place, Vancouver', 'B', 'GROUP'),
('Bosnia and Herzegovina', 'Qatar', '🇧🇦', '🇶🇦', '2026-06-20 21:00:00', 'BMO Field, Toronto', 'B', 'GROUP'),

-- Group C
('Brazil', 'Morocco', '🇧🇷', '🇲🇦', '2026-06-13 18:00:00', 'Rose Bowl, Los Angeles', 'C', 'GROUP'),
('Haiti', 'Scotland', '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-13 15:00:00', 'Estadio Akron, Zapopan', 'C', 'GROUP'),
('Brazil', 'Haiti', '🇧🇷', '🇭🇹', '2026-06-17 21:00:00', 'SoFi Stadium, Los Angeles', 'C', 'GROUP'),
('Scotland', 'Morocco', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇲🇦', '2026-06-17 18:00:00', 'Rose Bowl, Los Angeles', 'C', 'GROUP'),
('Brazil', 'Scotland', '🇧🇷', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-21 21:00:00', 'Rose Bowl, Los Angeles', 'C', 'GROUP'),
('Morocco', 'Haiti', '🇲🇦', '🇭🇹', '2026-06-21 21:00:00', 'SoFi Stadium, Los Angeles', 'C', 'GROUP'),

-- Group D
('USA', 'Paraguay', '🇺🇸', '🇵🇾', '2026-06-12 21:00:00', 'SoFi Stadium, Los Angeles', 'D', 'GROUP'),
('Australia', 'Turkey', '🇦🇺', '🇹🇷', '2026-06-13 12:00:00', 'Hard Rock Stadium, Miami', 'D', 'GROUP'),
('USA', 'Australia', '🇺🇸', '🇦🇺', '2026-06-17 15:00:00', 'Lumen Field, Seattle', 'D', 'GROUP'),
('Turkey', 'Paraguay', '🇹🇷', '🇵🇾', '2026-06-17 12:00:00', 'AT&T Stadium, Dallas', 'D', 'GROUP'),
('USA', 'Turkey', '🇺🇸', '🇹🇷', '2026-06-21 21:00:00', 'Lumen Field, Seattle', 'D', 'GROUP'),
('Paraguay', 'Australia', '🇵🇾', '🇦🇺', '2026-06-21 21:00:00', 'Hard Rock Stadium, Miami', 'D', 'GROUP'),

-- Group E
('Germany', 'Curacao', '🇩🇪', '🇨🇼', '2026-06-14 12:00:00', 'MetLife Stadium, New Jersey', 'E', 'GROUP'),
('Ivory Coast', 'Ecuador', '🇨🇮', '🇪🇨', '2026-06-14 15:00:00', 'AT&T Stadium, Dallas', 'E', 'GROUP'),
('Germany', 'Ivory Coast', '🇩🇪', '🇨🇮', '2026-06-18 18:00:00', 'MetLife Stadium, New Jersey', 'E', 'GROUP'),
('Ecuador', 'Curacao', '🇪🇨', '🇨🇼', '2026-06-18 15:00:00', 'AT&T Stadium, Dallas', 'E', 'GROUP'),
('Germany', 'Ecuador', '🇩🇪', '🇪🇨', '2026-06-22 21:00:00', 'AT&T Stadium, Dallas', 'E', 'GROUP'),
('Ivory Coast', 'Curacao', '🇨🇮', '🇨🇼', '2026-06-22 21:00:00', 'MetLife Stadium, New Jersey', 'E', 'GROUP'),

-- Group F
('Netherlands', 'Japan', '🇳🇱', '🇯🇵', '2026-06-14 18:00:00', 'Levi Stadium, San Francisco', 'F', 'GROUP'),
('Sweden', 'Tunisia', '🇸🇪', '🇹🇳', '2026-06-14 21:00:00', 'Arrowhead Stadium, Kansas City', 'F', 'GROUP'),
('Netherlands', 'Sweden', '🇳🇱', '🇸🇪', '2026-06-18 21:00:00', 'Levi Stadium, San Francisco', 'F', 'GROUP'),
('Tunisia', 'Japan', '🇹🇳', '🇯🇵', '2026-06-18 12:00:00', 'Arrowhead Stadium, Kansas City', 'F', 'GROUP'),
('Netherlands', 'Tunisia', '🇳🇱', '🇹🇳', '2026-06-22 21:00:00', 'Arrowhead Stadium, Kansas City', 'F', 'GROUP'),
('Japan', 'Sweden', '🇯🇵', '🇸🇪', '2026-06-22 21:00:00', 'Levi Stadium, San Francisco', 'F', 'GROUP'),

-- Group G
('Belgium', 'Egypt', '🇧🇪', '🇪🇬', '2026-06-15 15:00:00', 'Lumen Field, Seattle', 'G', 'GROUP'),
('Iran', 'New Zealand', '🇮🇷', '🇳🇿', '2026-06-15 21:00:00', 'SoFi Stadium, Los Angeles', 'G', 'GROUP'),
('Belgium', 'Iran', '🇧🇪', '🇮🇷', '2026-06-19 18:00:00', 'Lumen Field, Seattle', 'G', 'GROUP'),
('New Zealand', 'Egypt', '🇳🇿', '🇪🇬', '2026-06-19 15:00:00', 'SoFi Stadium, Los Angeles', 'G', 'GROUP'),
('Belgium', 'New Zealand', '🇧🇪', '🇳🇿', '2026-06-23 21:00:00', 'SoFi Stadium, Los Angeles', 'G', 'GROUP'),
('Egypt', 'Iran', '🇪🇬', '🇮🇷', '2026-06-23 21:00:00', 'Lumen Field, Seattle', 'G', 'GROUP'),

-- Group H
('Spain', 'Cape Verde', '🇪🇸', '🇨🇻', '2026-06-15 12:00:00', 'Mercedes-Benz Stadium, Atlanta', 'H', 'GROUP'),
('Saudi Arabia', 'Uruguay', '🇸🇦', '🇺🇾', '2026-06-15 18:00:00', 'Hard Rock Stadium, Miami', 'H', 'GROUP'),
('Spain', 'Saudi Arabia', '🇪🇸', '🇸🇦', '2026-06-19 21:00:00', 'Mercedes-Benz Stadium, Atlanta', 'H', 'GROUP'),
('Uruguay', 'Cape Verde', '🇺🇾', '🇨🇻', '2026-06-19 12:00:00', 'Hard Rock Stadium, Miami', 'H', 'GROUP'),
('Spain', 'Uruguay', '🇪🇸', '🇺🇾', '2026-06-23 21:00:00', 'Hard Rock Stadium, Miami', 'H', 'GROUP'),
('Cape Verde', 'Saudi Arabia', '🇨🇻', '🇸🇦', '2026-06-23 21:00:00', 'Mercedes-Benz Stadium, Atlanta', 'H', 'GROUP'),

-- Group I
('France', 'Senegal', '🇫🇷', '🇸🇳', '2026-06-16 15:00:00', 'MetLife Stadium, New Jersey', 'I', 'GROUP'),
('Iraq', 'Norway', '🇮🇶', '🇳🇴', '2026-06-16 18:00:00', 'Gillette Stadium, Boston', 'I', 'GROUP'),
('France', 'Iraq', '🇫🇷', '🇮🇶', '2026-06-20 21:00:00', 'MetLife Stadium, New Jersey', 'I', 'GROUP'),
('Norway', 'Senegal', '🇳🇴', '🇸🇳', '2026-06-20 18:00:00', 'Gillette Stadium, Boston', 'I', 'GROUP'),
('France', 'Norway', '🇫🇷', '🇳🇴', '2026-06-24 21:00:00', 'Gillette Stadium, Boston', 'I', 'GROUP'),
('Senegal', 'Iraq', '🇸🇳', '🇮🇶', '2026-06-24 21:00:00', 'MetLife Stadium, New Jersey', 'I', 'GROUP'),

-- Group J
('Argentina', 'Algeria', '🇦🇷', '🇩🇿', '2026-06-16 21:00:00', 'Arrowhead Stadium, Kansas City', 'J', 'GROUP'),
('Austria', 'Jordan', '🇦🇹', '🇯🇴', '2026-06-17 00:00:00', 'Levi Stadium, San Francisco', 'J', 'GROUP'),
('Argentina', 'Austria', '🇦🇷', '🇦🇹', '2026-06-20 15:00:00', 'Arrowhead Stadium, Kansas City', 'J', 'GROUP'),
('Jordan', 'Algeria', '🇯🇴', '🇩🇿', '2026-06-20 12:00:00', 'Levi Stadium, San Francisco', 'J', 'GROUP'),
('Argentina', 'Jordan', '🇦🇷', '🇯🇴', '2026-06-24 21:00:00', 'Levi Stadium, San Francisco', 'J', 'GROUP'),
('Algeria', 'Austria', '🇩🇿', '🇦🇹', '2026-06-24 21:00:00', 'Arrowhead Stadium, Kansas City', 'J', 'GROUP'),

-- Group K
('Portugal', 'DR Congo', '🇵🇹', '🇨🇩', '2026-06-17 13:00:00', 'NRG Stadium, Houston', 'K', 'GROUP'),
('Uzbekistan', 'Colombia', '🇺🇿', '🇨🇴', '2026-06-17 22:00:00', 'Estadio Azteca, Mexico City', 'K', 'GROUP'),
('Portugal', 'Uzbekistan', '🇵🇹', '🇺🇿', '2026-06-21 18:00:00', 'NRG Stadium, Houston', 'K', 'GROUP'),
('Colombia', 'DR Congo', '🇨🇴', '🇨🇩', '2026-06-21 15:00:00', 'Estadio Azteca, Mexico City', 'K', 'GROUP'),
('Portugal', 'Colombia', '🇵🇹', '🇨🇴', '2026-06-25 21:00:00', 'Estadio Azteca, Mexico City', 'K', 'GROUP'),
('DR Congo', 'Uzbekistan', '🇨🇩', '🇺🇿', '2026-06-25 21:00:00', 'NRG Stadium, Houston', 'K', 'GROUP'),

-- Group L
('England', 'Croatia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', '2026-06-17 16:00:00', 'AT&T Stadium, Dallas', 'L', 'GROUP'),
('Ghana', 'Panama', '🇬🇭', '🇵🇦', '2026-06-17 19:00:00', 'BMO Field, Toronto', 'L', 'GROUP'),
('England', 'Ghana', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇬🇭', '2026-06-21 12:00:00', 'AT&T Stadium, Dallas', 'L', 'GROUP'),
('Panama', 'Croatia', '🇵🇦', '🇭🇷', '2026-06-21 18:00:00', 'BMO Field, Toronto', 'L', 'GROUP'),
('England', 'Panama', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇵🇦', '2026-06-25 21:00:00', 'BMO Field, Toronto', 'L', 'GROUP'),
('Croatia', 'Ghana', '🇭🇷', '🇬🇭', '2026-06-25 21:00:00', 'AT&T Stadium, Dallas', 'L', 'GROUP');