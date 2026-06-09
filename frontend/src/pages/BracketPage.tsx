import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Navbar from "../components/Navbar";
import BracketTree from "../components/BracketTree";
import { getBracket, generateBracket } from "../api/bracket";
import type { BracketDto } from "../api/bracket";
import { useAuth } from "../context/AuthContext";
import { getTournament } from "../api/tournaments";
import type { Tournament } from "../api/tournaments";

export default function BracketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bracket, setBracket] = useState<BracketDto | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [noBracket, setNoBracket] = useState(false);

  const isOrganizer = !!(
    user &&
    tournament &&
    tournament.organizerUsername === user.username
  );

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getTournament(Number(id)),
      getBracket(Number(id)).catch(() => null),
    ])
      .then(([tRes, bRes]) => {
        setTournament(tRes.data.data);
        if (bRes) {
          setBracket(bRes.data.data);
        } else {
          setNoBracket(true);
        }
      })
      .catch(() => setError("Failed to load bracket."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const res = await generateBracket(Number(id));
      setBracket(res.data.data);
      setNoBracket(false);
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Failed to generate bracket.");
    } finally {
      setGenerating(false);
    }
  };

  const handleResultReported = async () => {
    if (!id) return;
    const res = await getBracket(Number(id));
    setBracket(res.data.data);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        {/* Header */}
        <Button
          onClick={() => navigate(`/tournaments/${id}`)}
          sx={{
            color: "#555570",
            fontSize: 13,
            mb: 3,
            pl: 0,
            "&:hover": { color: "#e8e8f0" },
          }}
        >
          ← Back to Tournament
        </Button>

        {tournament && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
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
                {tournament.gameName} · Single Elimination
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
                {tournament.title.toUpperCase()}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#555570", mt: 0.5 }}>
                BRACKET
              </Typography>
            </Box>

            {isOrganizer && noBracket && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={generating}
                sx={{ px: 3, py: 1.3, fontSize: 14, fontWeight: 500 }}
              >
                {generating ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: "#0d0d10" }} />
                    Generating...
                  </Box>
                ) : (
                  "⚡ Generate Bracket"
                )}
              </Button>
            )}
          </Box>
        )}

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
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && noBracket && (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              background: "#13131c",
              border: "1px solid #1f1f2e",
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#1f1f2e",
                mb: 1,
              }}
            >
              NO BRACKET YET
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#555570", mb: 3 }}>
              {isOrganizer
                ? 'Click "Generate Bracket" to seed the bracket from registered players.'
                : "The organizer hasn't generated the bracket yet."}
            </Typography>
            {isOrganizer && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={generating}
                sx={{ px: 3, py: 1.3 }}
              >
                {generating ? "Generating..." : "⚡ Generate Bracket"}
              </Button>
            )}
          </Box>
        )}

        {!loading && bracket && (
          <Box>
            {/* Bracket stats */}
            <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
              {[
                { label: "Total Rounds", value: bracket.totalRounds },
                { label: "Total Matches", value: bracket.matches.length },
                { label: "Status", value: bracket.status },
                {
                  label: "Completed",
                  value: `${
                    bracket.matches.filter((m) => m.status === "COMPLETED")
                      .length
                  } / ${
                    bracket.matches.filter((m) => m.status !== "BYE").length
                  }`,
                },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#555570",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      mb: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#e8e8f0",
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {isOrganizer && (
              <Typography sx={{ fontSize: 12, color: "#555570", mb: 2 }}>
                💡 As organizer, click any active match to report the result.
              </Typography>
            )}

            {/* Bracket tree */}
            <Box
              sx={{
                background: "#13131c",
                border: "1px solid #1f1f2e",
                borderRadius: 2,
                p: 3,
                overflowX: "auto",
              }}
            >
              <BracketTree
                bracket={bracket}
                isOrganizer={isOrganizer}
                onResultReported={handleResultReported}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
