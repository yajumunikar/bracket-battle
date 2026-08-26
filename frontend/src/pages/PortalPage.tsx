import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const TOOLS = [
  {
    icon: "⚡",
    label: "AI Powered · Admin Only",
    labelColor: "#ff6b35",
    accentColor: "#ff6b35",
    accentBg: "rgba(255,107,53,0.08)",
    accentBorder: "rgba(255,107,53,0.2)",
    title: "Arena Intel",
    desc: "Deep AI match predictions for FIFA World Cup 2026. Win probabilities, player stats, H2H analysis, community sentiment, and likely goalscorers — all in one prediction report.",
    chips: ["World Cup 2026", "AI Predictions", "Match Analysis"],
    cta: "View Predictions →",
    path: "/intel",
    adminOnly: true,
  },
  {
    icon: "📄",
    label: "Free · No Login Needed",
    labelColor: "#7c6aff",
    accentColor: "#7c6aff",
    accentBg: "rgba(124,106,255,0.08)",
    accentBorder: "rgba(124,106,255,0.2)",
    title: "AI Resume Analyzer",
    desc: "Upload your resume and get an instant AI-powered breakdown — overall score, ATS compatibility check, keyword gap analysis, improvement suggestions, and bullet point rewrites.",
    chips: ["PDF Upload", "ATS Check", "Keyword Analysis"],
    cta: "Analyze My Resume →",
    path: "/resume-analyzer",
    adminOnly: false,
  },
];

export default function PortalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10", color: "#e8e8f0" }}>
      <Navbar />

      {/* Header */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          pt: { xs: 6, md: 8 },
          pb: 5,
          borderBottom: "1px solid #1f1f2e",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(124,106,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7c6aff",
            mb: 2,
          }}
        >
          ✦ Portal
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: { xs: 42, md: 58 },
            fontWeight: 900,
            lineHeight: 0.95,
            color: "#fff",
            mb: 2,
          }}
        >
          YOUR{" "}
          <Box component="span" sx={{ color: "#7c6aff" }}>
            TOOLKIT.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#555570",
            maxWidth: 480,
            lineHeight: 1.7,
          }}
        >
          AI-powered tools built alongside BracketBattle. Free to use, no extra
          setup required.
        </Typography>
      </Box>

      {/* Tools Grid */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#555570",
            mb: 2.5,
          }}
        >
          Available Tools
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {TOOLS.map((tool) => {
            const locked = tool.adminOnly && !isAdmin;

            return (
              <Box
                key={tool.title}
                onClick={() => !locked && navigate(tool.path)}
                sx={{
                  background: "#13131c",
                  border: "1px solid #1f1f2e",
                  borderTop: `2px solid ${
                    locked ? "#2a2a38" : tool.accentColor
                  }`,
                  borderRadius: 2,
                  p: 3.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 260,
                  cursor: locked ? "default" : "pointer",
                  opacity: locked ? 0.5 : 1,
                  transition: "border-color 0.2s, transform 0.15s",
                  "&:hover": locked
                    ? {}
                    : {
                        borderColor: tool.accentColor,
                        transform: "translateY(-2px)",
                      },
                }}
              >
                <Box>
                  {/* Icon + label row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        background: locked
                          ? "rgba(42,42,56,0.5)"
                          : tool.accentBg,
                        border: `1px solid ${
                          locked ? "#2a2a38" : tool.accentBorder
                        }`,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {tool.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: locked ? "#555570" : tool.labelColor,
                      }}
                    >
                      {tool.label}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: locked ? "#555570" : "#e8e8f0",
                      mb: 1,
                      lineHeight: 1.1,
                    }}
                  >
                    {tool.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{ fontSize: 13, color: "#555570", lineHeight: 1.75 }}
                  >
                    {tool.desc}
                  </Typography>
                </Box>

                {/* Footer row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                    {tool.chips.map((chip) => (
                      <Chip
                        key={chip}
                        label={chip}
                        size="small"
                        sx={{
                          fontSize: 10,
                          height: 22,
                          background: locked
                            ? "rgba(42,42,56,0.5)"
                            : tool.accentBg,
                          color: locked ? "#555570" : tool.accentColor,
                          border: `1px solid ${
                            locked ? "#2a2a38" : tool.accentBorder
                          }`,
                          borderRadius: "3px",
                        }}
                      />
                    ))}
                  </Box>

                  {locked ? (
                    <Typography sx={{ fontSize: 12, color: "#555570" }}>
                      🔒 Admin only
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: tool.accentColor,
                        fontWeight: 600,
                      }}
                    >
                      {tool.cta}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
