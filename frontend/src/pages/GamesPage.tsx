import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getGames } from "../api/games";
import type { Game } from "../api/games";

const GAME_ART: Record<
  string,
  { art: string; accent: string; description: string }
> = {
  "ea-fc-25": {
    art: "https://cdn1.epicgames.com/offer/1d4d85b1051e41ee8f1a099e99d59f3f/EGS_EASPORTSFC26StandardEdition_EACANADA_S1_2560x1440-efabe29766334696db018632ea5ba492",
    accent: "#00ffe0",
    description:
      "The beautiful game goes competitive. Build your squad and dominate the pitch.",
  },
  valorant: {
    art: "https://japannext.fr/cdn/shop/articles/Valorant-Wallpaper-Boys-Rainbow-Display_a94881d6-c6a5-4245-9da6-8f07c55a48d1.jpg?v=1760444880",
    accent: "#ff4655",
    description:
      "Tactical precision meets explosive gunplay. Prove yourself as the top agent.",
  },
  "call-of-duty": {
    art: "https://www.dexerto.com/cdn-image/wp-content/uploads/2022/02/25/cod-2023-cancel-opinion.jpg?width=1200&quality=60&format=auto",
    accent: "#ff6b35",
    description:
      "Drop in, gear up, and outlast the competition in high-stakes gunfight brackets.",
  },
  fortnite: {
    art: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scjpx3.webp",
    accent: "#7b5ef8",
    description:
      "Build fast, shoot faster. Solo and squad tournaments every weekend.",
  },
  "rocket-league": {
    art: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scs3a5.webp",
    accent: "#00aaff",
    description:
      "Rocket-powered cars meet soccer in the most competitive arena on the planet.",
  },
  "apex-legends": {
    art: "https://assets.nintendo.com/image/upload/q_auto:best/f_auto/dpr_2.0/ncom/en_US/articles/2025/check-out-whats-new-this-season-with-apex-legends-tm-showdown/Apex_S26_PrimaryArt",
    accent: "#c8102e",
    description:
      "The arena is hot. Squad up and fight for glory in battle royale brackets.",
  },
};

const PLATFORM_LABEL: Record<string, string> = {
  PC: "PC",
  CROSS_PLATFORM: "Cross-Platform",
  CONSOLE: "Console",
  MOBILE: "Mobile",
};

export default function GamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getGames()
      .then((res) => setGames(res.data.data))
      .catch(() => setError("Failed to load games."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        {/* Header */}
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#555570",
            mb: 1,
          }}
        >
          Supported Games
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            mb: 1,
          }}
        >
          THE GAMES
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#8888a8", mb: 5 }}>
          Browse tournaments by game. More games coming soon.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#00ffe0" }} />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              background: "#ff000015",
              color: "#ff6b6b",
              border: "1px solid #ff000030",
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {games.map((game) => {
              const meta = GAME_ART[game.slug] ?? {
                art: null,
                accent: "#555570",
                description: "Compete in tournaments for this game.",
              };

              return (
                <Box
                  key={game.id}
                  onClick={() => navigate(`/tournaments?gameId=${game.id}`)}
                  sx={{
                    position: "relative",
                    height: 220,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${meta.accent}30`,
                    cursor: "pointer",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 40px ${meta.accent}25`,
                      borderColor: `${meta.accent}60`,
                      "& .game-overlay": { opacity: 0.5 },
                      "& .game-img": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  {/* Background art */}
                  {meta.art ? (
                    <Box
                      component="img"
                      src={meta.art}
                      className="game-img"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        background: "#13131c",
                      }}
                    />
                  )}

                  {/* Dark gradient overlay */}
                  <Box
                    className="game-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(8,8,12,0.97) 0%, rgba(8,8,12,0.6) 50%, rgba(8,8,12,0.2) 100%)",
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {/* Accent glow */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse at 50% 100%, ${meta.accent}18 0%, transparent 70%)`,
                    }}
                  />

                  {/* Content */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: 2.5,
                    }}
                  >
                    {/* Platform badge */}
                    <Chip
                      label={PLATFORM_LABEL[game.platform] ?? game.platform}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        mb: 1,
                        fontSize: 9,
                        height: 18,
                        background: `${meta.accent}15`,
                        color: meta.accent,
                        border: `1px solid ${meta.accent}30`,
                        borderRadius: "3px",
                        letterSpacing: 0.5,
                      }}
                    />

                    {/* Game name */}
                    <Typography
                      sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1,
                        mb: 0.75,
                        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                      }}
                    >
                      {game.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#8888a8",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1.5,
                      }}
                    >
                      {meta.description}
                    </Typography>

                    {/* Browse CTA */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 1.5,
                          background: meta.accent,
                          transition: "width 0.3s ease",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: meta.accent,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        Browse Tournaments
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
