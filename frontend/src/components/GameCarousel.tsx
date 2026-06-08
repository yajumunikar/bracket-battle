import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GAMES = [
  {
    title: "EA FC 26",
    short: "FC26",
    description:
      "The beautiful game goes competitive. Build your squad and dominate the pitch in ranked brackets.",
    tournaments: 19,
    prizePool: "$12,000",
    accent: "#00ffe0",
    live: true,
    img: "https://cdn1.epicgames.com/offer/1d4d85b1051e41ee8f1a099e99d59f3f/EGS_EASPORTSFC26StandardEdition_EACANADA_S1_2560x1440-efabe29766334696db018632ea5ba492",
    art: "https://cdn1.epicgames.com/offer/1d4d85b1051e41ee8f1a099e99d59f3f/EGS_EASPORTSFC26StandardEdition_EACANADA_S1_2560x1440-efabe29766334696db018632ea5ba492",
    fallbackBg:
      "linear-gradient(135deg, #001a12 0%, #003d2a 50%, #001a12 100%)",
  },
  {
    title: "Call of Duty",
    short: "COD",
    description:
      "Drop in, gear up, and outlast the competition in high-stakes gunfight brackets.",
    tournaments: 12,
    prizePool: "$8,500",
    accent: "#ff6b35",
    live: true,
    img: "https://www.dexerto.com/cdn-image/wp-content/uploads/2022/02/25/cod-2023-cancel-opinion.jpg?width=1200&quality=60&format=auto",
    art: "https://www.dexerto.com/cdn-image/wp-content/uploads/2022/02/25/cod-2023-cancel-opinion.jpg?width=1200&quality=60&format=auto",
    fallbackBg:
      "linear-gradient(135deg, #1a0800 0%, #3d1500 50%, #1a0800 100%)",
  },
  {
    title: "Valorant",
    short: "VAL",
    description:
      "Tactical precision meets explosive gunplay. Climb through the brackets, agent.",
    tournaments: 24,
    prizePool: "$15,200",
    accent: "#ff4655",
    live: true,
    img: "https://japannext.fr/cdn/shop/articles/Valorant-Wallpaper-Boys-Rainbow-Display_a94881d6-c6a5-4245-9da6-8f07c55a48d1.jpg?v=1760444880",
    art: "https://japannext.fr/cdn/shop/articles/Valorant-Wallpaper-Boys-Rainbow-Display_a94881d6-c6a5-4245-9da6-8f07c55a48d1.jpg?v=1760444880",
    fallbackBg:
      "linear-gradient(135deg, #1a0003 0%, #3d000c 50%, #1a0003 100%)",
  },
  {
    title: "Counter-Strike 2",
    short: "CS2",
    description:
      "The world's most iconic FPS. Prove your aim on the global competitive stage.",
    tournaments: 18,
    prizePool: "$22,000",
    accent: "#f0a500",
    live: false,
    img: "https://www.nme.com/wp-content/uploads/2023/03/Counter-Strike-2-Dust-2.jpg",
    art: "https://www.nme.com/wp-content/uploads/2023/03/Counter-Strike-2-Dust-2.jpg",
    fallbackBg:
      "linear-gradient(135deg, #0d0900 0%, #2a1f00 50%, #0d0900 100%)",
  },
  {
    title: "Apex Legends",
    short: "APX",
    description:
      "The arena is hot. Squad up and fight for glory in battle royale brackets.",
    tournaments: 9,
    prizePool: "$6,300",
    accent: "#c8102e",
    live: false,
    img: "https://assets.nintendo.com/image/upload/q_auto:best/f_auto/dpr_2.0/ncom/en_US/articles/2025/check-out-whats-new-this-season-with-apex-legends-tm-showdown/Apex_S26_PrimaryArt",
    art: "https://assets.nintendo.com/image/upload/q_auto:best/f_auto/dpr_2.0/ncom/en_US/articles/2025/check-out-whats-new-this-season-with-apex-legends-tm-showdown/Apex_S26_PrimaryArt",
    fallbackBg:
      "linear-gradient(135deg, #1a0003 0%, #3d0008 50%, #1a0003 100%)",
  },
];

const INTERVAL = 5000;

export default function GameCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current || transitioning) return;
      setTransitioning(true);
      setProgress(0);
      startTime.current = Date.now();
      setTimeout(() => {
        setCurrent(idx);
        setTransitioning(false);
      }, 400);
    },
    [current, transitioning]
  );

  const next = useCallback(
    () => goTo((current + 1) % GAMES.length),
    [current, goTo]
  );
  const prev = useCallback(
    () => goTo((current - 1 + GAMES.length) % GAMES.length),
    [current, goTo]
  );

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    startTime.current = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
    }, 30);
    intervalRef.current = setInterval(next, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused, next]);

  const game = GAMES[current];

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 340, md: 460 },
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${game.accent}40`,
        boxShadow: `0 0 0 1px ${game.accent}15, 0 0 60px ${game.accent}25, 0 20px 60px rgba(0,0,0,0.6)`,
        transition: "box-shadow 0.8s ease, border-color 0.8s ease",
      }}
    >
      {/* === ARTWORK BACKGROUND === */}
      {GAMES.map((g, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? (transitioning ? 0 : 1) : 0,
            transition: "opacity 0.4s ease",
            zIndex: 0,
          }}
        >
          {!imgErrors[i] ? (
            <Box
              component="img"
              src={g.art}
              onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                animation:
                  i === current
                    ? "slowZoom 12s ease-in-out infinite alternate"
                    : "none",
                "@keyframes slowZoom": {
                  from: { transform: "scale(1)" },
                  to: { transform: "scale(1.08)" },
                },
              }}
            />
          ) : (
            <Box
              sx={{ width: "100%", height: "100%", background: g.fallbackBg }}
            />
          )}
        </Box>
      ))}

      {/* === GRADIENT OVERLAYS === */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to right, rgba(8,8,12,0.97) 0%, rgba(8,8,12,0.75) 45%, rgba(8,8,12,0.15) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(8,8,12,1) 0%, rgba(8,8,12,0.5) 35%, transparent 65%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(ellipse at 20% 50%, ${game.accent}12 0%, transparent 60%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* === SCANLINE TEXTURE === */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* === LIVE BADGE === */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {game.live ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              background: "rgba(255, 40, 40, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,60,60,0.4)",
              borderRadius: "6px",
              px: 1.25,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ff3c3c",
                boxShadow: "0 0 6px #ff3c3c",
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.5, transform: "scale(0.8)" },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#ff6060",
                letterSpacing: 1.5,
              }}
            >
              LIVE NOW
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              px: 1.25,
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#8888a8",
                letterSpacing: 1.5,
              }}
            >
              ACTIVE TOURNAMENTS
            </Typography>
          </Box>
        )}
      </Box>

      {/* === SLIDE COUNTER === */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          background: "rgba(8,8,12,0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "6px",
          px: 1.25,
          py: 0.4,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13,
            color: "#555570",
            letterSpacing: 2,
          }}
        >
          <Box
            component="span"
            sx={{ color: game.accent, transition: "color 0.8s" }}
          >
            {String(current + 1).padStart(2, "0")}
          </Box>
          {" / "}
          {String(GAMES.length).padStart(2, "0")}
        </Typography>
      </Box>

      {/* === MAIN CONTENT === */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: { xs: 2.5, md: 3 },
          pb: { xs: 3.5, md: 4 },
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Game short label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}>
          <Box
            sx={{
              background: `${game.accent}20`,
              border: `1px solid ${game.accent}40`,
              borderRadius: "4px",
              px: 1,
              py: 0.2,
              transition: "all 0.8s ease",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: game.accent,
                transition: "color 0.8s ease",
              }}
            >
              {game.short}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 10,
              color: "#555570",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Featured Game
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: { xs: 34, md: 48 },
            fontWeight: 900,
            color: "#fff",
            lineHeight: 0.95,
            mb: 1.25,
            textShadow: `0 2px 20px rgba(0,0,0,0.8), 0 0 40px ${game.accent}20`,
            transition: "text-shadow 0.8s ease",
          }}
        >
          {game.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 13,
            color: "#9999b8",
            lineHeight: 1.6,
            maxWidth: 300,
            mb: 2,
          }}
        >
          {game.description}
        </Typography>

        {/* Stats — glassmorphism cards */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
          {[
            {
              label: "Active Tournaments",
              value: game.tournaments,
              suffix: "",
            },
            { label: "Total Prize Pool", value: game.prizePool, suffix: "" },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${game.accent}25`,
                borderRadius: "10px",
                px: 2,
                py: 1.25,
                minWidth: 110,
                transition: "border-color 0.8s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  borderColor: `${game.accent}50`,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  color: "#555570",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 26,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: game.accent,
                  transition: "color 0.8s ease",
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box>
          <Button
            onClick={() => navigate("/tournaments")}
            sx={{
              background: game.accent,
              color: "#0d0d10",
              fontWeight: 700,
              fontSize: 12,
              px: 2.5,
              py: 0.9,
              borderRadius: "8px",
              letterSpacing: 0.5,
              transition:
                "background 0.8s ease, transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: `0 4px 20px ${game.accent}40`,
              "&:hover": {
                background: "#fff",
                transform: "translateY(-2px)",
                boxShadow: `0 8px 30px ${game.accent}50`,
              },
            }}
          >
            View Tournaments →
          </Button>
        </Box>
      </Box>

      {/* === NAV ARROWS === */}
      <IconButton
        onClick={prev}
        sx={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 36,
          height: 36,
          background: "rgba(8,8,12,0.7)",
          backdropFilter: "blur(12px)",
          border: `1px solid rgba(255,255,255,0.1)`,
          color: "#e8e8f0",
          transition: "all 0.2s ease",
          "&:hover": {
            background: game.accent,
            color: "#0d0d10",
            borderColor: game.accent,
            transform: "translateY(-50%) scale(1.1)",
          },
        }}
      >
        <Typography sx={{ fontSize: 18, lineHeight: 1, mt: "-2px" }}>
          ‹
        </Typography>
      </IconButton>

      <IconButton
        onClick={next}
        sx={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 36,
          height: 36,
          background: "rgba(8,8,12,0.7)",
          backdropFilter: "blur(12px)",
          border: `1px solid rgba(255,255,255,0.1)`,
          color: "#e8e8f0",
          transition: "all 0.2s ease",
          "&:hover": {
            background: game.accent,
            color: "#0d0d10",
            borderColor: game.accent,
            transform: "translateY(-50%) scale(1.1)",
          },
        }}
      >
        <Typography sx={{ fontSize: 18, lineHeight: 1, mt: "-2px" }}>
          ›
        </Typography>
      </IconButton>

      {/* === BOTTOM BAR: DOTS + PROGRESS === */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        {/* Progress bar */}
        <Box sx={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(to right, ${game.accent}80, ${game.accent})`,
              boxShadow: `0 0 10px ${game.accent}80`,
              transition: "background 0.8s ease, box-shadow 0.8s ease",
            }}
          />
        </Box>

        {/* Dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            py: 1.5,
            background:
              "linear-gradient(to top, rgba(8,8,12,0.8) 0%, transparent 100%)",
          }}
        >
          {GAMES.map((g, i) => (
            <Box
              key={i}
              onClick={() => goTo(i)}
              sx={{
                height: 4,
                width: i === current ? 24 : 6,
                borderRadius: 2,
                background:
                  i === current ? game.accent : "rgba(255,255,255,0.2)",
                cursor: "pointer",
                transition: "all 0.4s ease",
                boxShadow: i === current ? `0 0 8px ${game.accent}` : "none",
                "&:hover": {
                  background:
                    i === current ? game.accent : "rgba(255,255,255,0.4)",
                  transform: "scaleY(1.5)",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* === THUMBNAIL STRIP (right edge) === */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 8,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 1,
          pr: 1.5,
        }}
      >
        {GAMES.map((g, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: 40,
              height: 52,
              borderRadius: "6px",
              overflow: "hidden",
              cursor: "pointer",
              border: `2px solid ${
                i === current ? g.accent : "rgba(255,255,255,0.08)"
              }`,
              opacity: i === current ? 1 : 0.45,
              transition: "all 0.3s ease",
              boxShadow: i === current ? `0 0 12px ${g.accent}60` : "none",
              "&:hover": { opacity: 1, borderColor: g.accent },
              flexShrink: 0,
            }}
          >
            {!imgErrors[i] ? (
              <Box
                component="img"
                src={g.img}
                onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{ width: "100%", height: "100%", background: g.fallbackBg }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
