import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTournaments } from "../api/tournaments";
import type { Tournament } from "../api/tournaments";

const STATUS_COLOR: Record<string, string> = {
  PUBLISHED: "#00ffe0",
  LOCKED: "#7b5ef8",
  COMPLETED: "#555570",
  DRAFT: "#ff6b35",
};

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Open",
  LOCKED: "● Live",
  COMPLETED: "Completed",
  DRAFT: "Draft",
};

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTournaments()
      .then((res) => setTournaments(res.data.data.content))
      .catch(() =>
        setError("Failed to load tournaments. Is the backend running?")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#555570",
                mb: 1,
              }}
            >
              All Tournaments
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 42,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              THE ARENA
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/tournaments/create")}
            sx={{ px: 3, py: 1.3, fontSize: 14, fontWeight: 500, mt: 1 }}
          >
            + Host Tournament
          </Button>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#00ffe0" }} />
          </Box>
        )}

        {/* Error */}
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

        {/* Empty state */}
        {!loading && !error && tournaments.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#1f1f2e",
                mb: 1,
              }}
            >
              NO TOURNAMENTS YET
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#555570", mb: 3 }}>
              Be the first to host one.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/tournaments/create")}
              sx={{ px: 3, py: 1.3 }}
            >
              Host a Tournament
            </Button>
          </Box>
        )}

        {/* Tournament grid */}
        {!loading && !error && tournaments.length > 0 && (
          <Grid container spacing={1.5}>
            {tournaments.map((t) => (
              <Grid item xs={12} md={4} key={t.id}>
                <Box
                  onClick={() => navigate(`/tournaments/${t.id}`)}
                  sx={{
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderTop: `2px solid ${
                      STATUS_COLOR[t.status] ?? "#555570"
                    }`,
                    borderRadius: 2,
                    p: 2.5,
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    "&:hover": {
                      borderColor: STATUS_COLOR[t.status] ?? "#555570",
                    },
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
                    {t.gameName}
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
                    {t.title}
                  </Typography>
                  {t.description && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#555570",
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {t.description}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "#555570",
                          letterSpacing: 1,
                        }}
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
                        {t.prizePool
                          ? `$${t.prizePool.toLocaleString()}`
                          : "Free"}
                      </Typography>
                    </Box>
                    <Chip
                      label={STATUS_LABEL[t.status] ?? t.status}
                      size="small"
                      sx={{
                        fontSize: 10,
                        height: 22,
                        background: `${STATUS_COLOR[t.status] ?? "#555570"}15`,
                        color: STATUS_COLOR[t.status] ?? "#555570",
                        border: `1px solid ${
                          STATUS_COLOR[t.status] ?? "#555570"
                        }30`,
                        borderRadius: "3px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1.5,
                      pt: 1.5,
                      borderTop: "1px solid #1f1f2e",
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#555570" }}>
                      {t.currentParticipants} / {t.maxParticipants} players
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#555570" }}>
                      by {t.organizerUsername}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
