import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GAMES = [
  {
    title: "Call of Duty",
    description:
      "Drop in, gear up, and outlast the competition in high-stakes gunfight brackets.",
    tournaments: 12,
    prizePool: "$8,500",
    color: "#ff6b35",
    bg: "linear-gradient(135deg, #1a0a00 0%, #3d1a00 40%, #1a0a00 100%)",
    accent: "#ff6b35",
    icon: "🎯",
  },
  {
    title: "Valorant",
    description:
      "Tactical precision meets explosive gunplay. Climb through the brackets agent.",
    tournaments: 24,
    prizePool: "$15,200",
    color: "#ff4655",
    bg: "linear-gradient(135deg, #1a0005 0%, #3d000f 40%, #1a0005 100%)",
    accent: "#ff4655",
    icon: "⚡",
  },
  {
    title: "Counter-Strike 2",
    description:
      "The world's most iconic FPS. Prove your aim on the global stage.",
    tournaments: 18,
    prizePool: "$22,000",
    color: "#f0a500",
    bg: "linear-gradient(135deg, #0d0a00 0%, #2d2000 40%, #0d0a00 100%)",
    accent: "#f0a500",
    icon: "💣",
  },
  {
    title: "Fortnite",
    description:
      "Build fast, shoot faster. Solo and squad tournaments running every weekend.",
    tournaments: 31,
    prizePool: "$11,750",
    color: "#7b5ef8",
    bg: "linear-gradient(135deg, #05001a 0%, #15003d 40%, #05001a 100%)",
    accent: "#7b5ef8",
    icon: "🏗️",
  },
  {
    title: "Apex Legends",
    description:
      "The arena is hot. Squad up and fight for glory in battle royale brackets.",
    tournaments: 9,
    prizePool: "$6,300",
    color: "#00ffe0",
    bg: "linear-gradient(135deg, #001a18 0%, #003d38 40%, #001a18 100%)",
    accent: "#00ffe0",
    icon: "🔥",
  },
];

const INTERVAL = 4000;

export default function GameCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current || fading) return;
      setFading(true);
      setPrev(current);
      setTimeout(() => {
        setCurrent(idx);
        setFading(false);
        setPrev(null);
        setProgress(0);
      }, 350);
    },
    [current, fading]
  );

  const next = useCallback(
    () => goTo((current + 1) % GAMES.length),
    [current, goTo]
  );
  const prev_ = useCallback(
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
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (INTERVAL / 50), 100));
    }, 50);
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
        height: { xs: 320, md: 420 },
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${game.accent}30`,
        boxShadow: `0 0 40px ${game.accent}20, 0 0 80px ${game.accent}10`,
        transition: "box-shadow 0.6s ease, border-color 0.6s ease",
        cursor: "default",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: game.bg,
          transition: "background 0.6s ease",
          animation: "zoomIn 8s ease-in-out infinite alternate",
          "@keyframes zoomIn": {
            from: { transform: "scale(1)" },
            to: { transform: "scale(1.05)" },
          },
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${game.accent}08 1px, transparent 1px), linear-gradient(90deg, ${game.accent}08 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transition: "background 0.6s ease",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(13,13,16,0.95) 0%, rgba(13,13,16,0.4) 60%, transparent 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(13,13,16,0.9) 0%, transparent 50%)",
        }}
      />

      {/* Glow orb */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "20%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${game.accent}25 0%, transparent 70%)`,
          transition: "background 0.6s ease",
          filter: "blur(20px)",
        }}
      />

      {/* Fade overlay for transition */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "#0d0d10",
          opacity: fading ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: { xs: 2.5, md: 3.5 },
        }}
      >
        {/* Icon + game label */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: 20 }}>{game.icon}</Typography>
          <Typography
            sx={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: game.accent,
              fontWeight: 500,
              transition: "color 0.6s ease",
            }}
          >
            Featured Game
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: { xs: 32, md: 44 },
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            mb: 1,
            textShadow: `0 0 30px ${game.accent}40`,
            transition: "text-shadow 0.6s ease",
          }}
        >
          {game.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 13,
            color: "#8888a8",
            lineHeight: 1.6,
            maxWidth: 320,
            mb: 2,
          }}
        >
          {game.description}
        </Typography>

        {/* Stats — glassmorphism pills */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
          {[
            { label: "Tournaments", value: game.tournaments },
            { label: "Prize Pool", value: game.prizePool },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${game.accent}25`,
                borderRadius: 1.5,
                px: 1.5,
                py: 0.75,
                transition: "border-color 0.6s ease",
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  color: "#555570",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: game.accent,
                  lineHeight: 1.2,
                  transition: "color 0.6s ease",
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
            size="small"
            sx={{
              background: game.accent,
              color: "#0d0d10",
              fontWeight: 700,
              fontSize: 12,
              px: 2.5,
              py: 0.75,
              borderRadius: 1,
              transition: "background 0.6s ease",
              "&:hover": { background: "#fff", transform: "translateY(-1px)" },
            }}
          >
            View Tournaments →
          </Button>
        </Box>
      </Box>

      {/* Nav arrows */}
      <IconButton
        onClick={prev_}
        sx={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          background: "rgba(13,13,16,0.7)",
          color: "#e8e8f0",
          width: 32,
          height: 32,
          fontSize: 16,
          border: "1px solid #1f1f2e",
          "&:hover": {
            background: game.accent,
            color: "#0d0d10",
            borderColor: game.accent,
          },
          transition: "all 0.2s",
        }}
      >
        ‹
      </IconButton>
      <IconButton
        onClick={next}
        sx={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          background: "rgba(13,13,16,0.7)",
          color: "#e8e8f0",
          width: 32,
          height: 32,
          fontSize: 16,
          border: "1px solid #1f1f2e",
          "&:hover": {
            background: game.accent,
            color: "#0d0d10",
            borderColor: game.accent,
          },
          transition: "all 0.2s",
        }}
      >
        ›
      </IconButton>

      {/* Progress bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "#1f1f2e",
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            height: "100%",
            background: game.accent,
            width: `${progress}%`,
            transition: "background 0.6s ease",
            boxShadow: `0 0 8px ${game.accent}`,
          }}
        />
      </Box>

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          gap: 0.75,
          zIndex: 3,
        }}
      >
        {GAMES.map((g, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? game.accent : "#333350",
              cursor: "pointer",
              transition: "all 0.3s ease, background 0.6s ease",
              "&:hover": { background: game.accent },
            }}
          />
        ))}
      </Box>

      {/* Slide counter */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 3,
          background: "rgba(13,13,16,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid #1f1f2e",
          borderRadius: 1,
          px: 1,
          py: 0.25,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 12,
            color: "#555570",
            letterSpacing: 1,
          }}
        >
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(GAMES.length).padStart(2, "0")}
        </Typography>
      </Box>
    </Box>
  );
}
