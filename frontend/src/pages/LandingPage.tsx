import { Box, Button, Typography, Grid, Chip } from "@mui/material";
import Navbar from "../components/Navbar";

const TOURNAMENTS = [
  {
    game: "Valorant",
    name: "Night Ops Open",
    prize: "$500",
    status: "live",
    slots: "14 / 16 slots filled",
  },
  {
    game: "Rocket League",
    name: "Supersonic Series #3",
    prize: "$250",
    status: "open",
    slots: "8 / 32 slots filled",
  },
  {
    game: "EA FC 25",
    name: "East Coast Cup",
    prize: "$1,000",
    status: "soon",
    slots: "Starts Jun 14",
  },
];

const STATUS_COLOR: Record<string, string> = {
  live: "#00ffe0",
  open: "#7b5ef8",
  soon: "#ff6b35",
};

const STATUS_LABEL: Record<string, string> = {
  live: "● Live",
  open: "Open",
  soon: "Coming Soon",
};

const STEPS = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds. Pick your games, build your profile, and get ready to compete.",
  },
  {
    num: "02",
    title: "Join or Host a Bracket",
    desc: "Browse open tournaments and register, or create your own with custom rules and prize pools.",
  },
  {
    num: "03",
    title: "Battle It Out",
    desc: "Compete through the bracket, report results, and climb to the top. Only one walks away.",
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      {/* Hero */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: 7, md: 9 },
          borderBottom: "1px solid #1f1f2e",
          background:
            "radial-gradient(ellipse at 70% 0%, rgba(0,255,224,0.07) 0%, transparent 60%)",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#00ffe0",
            mb: 2,
          }}
        >
          Gaming Tournament Platform
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 52, md: 72 },
            lineHeight: 0.95,
            color: "#fff",
            mb: 2.5,
          }}
        >
          COMPETE.
          <br />
          <Box component="span" sx={{ color: "#00ffe0" }}>
            BATTLE.
          </Box>
          <br />
          DOMINATE.
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#8888a8",
            maxWidth: 400,
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Join brackets, run tournaments, and prove you're the best. Built for
          the US gaming community.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 3.5, py: 1.3, fontSize: 14, fontWeight: 500 }}
          >
            Browse Tournaments
          </Button>
          <Button sx={{ color: "#8888a8", fontSize: 14 }}>
            Host a Tournament →
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            mt: 6,
            pt: 4,
            borderTop: "1px solid #1f1f2e",
          }}
        >
          {[
            ["1,240", "Active Players"],
            ["86", "Tournaments Run"],
            ["6", "Games Supported"],
          ].map(([val, label]) => (
            <Box key={label}>
              <Typography
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {val}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#555570", mt: 0.5 }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tournaments */}
      <Box
        sx={{ px: { xs: 3, md: 6 }, py: 5, borderBottom: "1px solid #1f1f2e" }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#555570",
            mb: 2.5,
          }}
        >
          Live &amp; Upcoming Tournaments
        </Typography>
        <Grid container spacing={1.5}>
          {TOURNAMENTS.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Box
                sx={{
                  background: "#13131c",
                  border: "1px solid #1f1f2e",
                  borderTop: `2px solid ${STATUS_COLOR[t.status]}`,
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#555570",
                    mb: 0.75,
                  }}
                >
                  {t.game}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#e8e8f0",
                    mb: 1.5,
                  }}
                >
                  {t.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: 10, color: "#555570", letterSpacing: 1 }}
                    >
                      Prize Pool
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {t.prize}
                    </Typography>
                  </Box>
                  <Chip
                    label={STATUS_LABEL[t.status]}
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 22,
                      background: `${STATUS_COLOR[t.status]}15`,
                      color: STATUS_COLOR[t.status],
                      border: `1px solid ${STATUS_COLOR[t.status]}30`,
                      borderRadius: "3px",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 11, color: "#555570", mt: 1 }}>
                  {t.slots}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Box
        sx={{ px: { xs: 3, md: 6 }, py: 5, borderBottom: "1px solid #1f1f2e" }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#555570",
            mb: 2.5,
          }}
        >
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {STEPS.map((s) => (
            <Grid item xs={12} md={4} key={s.num}>
              <Typography
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 52,
                  fontWeight: 900,
                  color: "#1f1f2e",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#e8e8f0",
                  mb: 0.75,
                }}
              >
                {s.title}
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: "#555570", lineHeight: 1.7 }}
              >
                {s.desc}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer CTA */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 30,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          READY TO{" "}
          <Box component="span" sx={{ color: "#00ffe0" }}>
            ENTER
          </Box>{" "}
          THE ARENA?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 3.5, py: 1.3, fontSize: 14 }}
        >
          Create Account — It's Free
        </Button>
      </Box>
    </Box>
  );
}
