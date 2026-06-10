import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getIntelPrediction } from "../api/intel";

interface Prediction {
  predictedWinner: string;
  predictedScore: string;
  confidencePercent: number;
  riskRating: string;
  winProbabilities: { team1: number; draw: number; team2: number };
  team1Form: string[];
  team1FormDetails: string[];
  team2Form: string[];
  team2FormDetails: string[];
  headToHead: string;
  keyInsights: string[];
  team1Strengths: string[];
  team1Weaknesses: string[];
  team2Strengths: string[];
  team2Weaknesses: string[];
  upsetPotentialPercent: number;
  overUnder: { line: number; overPercent: number; prediction: string };
  btts: { prediction: string; percent: number };
  predictedCorners: { min: number; max: number };
  predictedCards: { min: number; max: number };
  likelyGoalscorers: {
    name: string;
    team: string;
    percent: number;
    type: string;
  }[];
  suggestedCombo: string[];
  comboProbabilityPercent: number;
  matchSummary: string;
  disclaimer: string;
}

interface MatchDto {
  id: number;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  competition: string;
  matchDate: string;
  venue: string;
  groupName: string;
  stage: string;
  status: string;
  actualScore: string | null;
}

const RISK_COLOR: Record<string, string> = {
  LOW: "#00ffe0",
  MEDIUM: "#ff6b35",
  HIGH: "#ff4444",
};

const FORM_COLOR: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  W: { bg: "#00ffe015", color: "#00ffe0", border: "#00ffe030" },
  D: { bg: "#ff6b3515", color: "#ff6b35", border: "#ff6b3530" },
  L: { bg: "#ff444415", color: "#ff4444", border: "#ff444430" },
};

export default function MatchPredictionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchDto | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin || !id) return;
    fetchPrediction();
  }, [isAdmin, id]);

  const fetchPrediction = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getIntelPrediction(Number(id));
      setMatch(res.data.data.match);
      setPrediction(res.data.data.prediction);
    } catch {
      setError("Failed to load prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    }) + " EST";

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
            textAlign: "center",
            px: 3,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#13131c",
              border: "1px solid #1f1f2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: 32 }}>🔒</Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#555570",
              mb: 1,
            }}
          >
            Restricted Access
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 42,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              mb: 2,
            }}
          >
            ARENA <span style={{ color: "#00ffe0" }}>INTEL</span>
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "#555570",
              maxWidth: 380,
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            This feature is currently in private access. AI-powered match
            analysis and predictions for major sporting events.
          </Typography>
          <Box
            sx={{
              background: "#13131c",
              border: "1px solid #1f1f2e",
              borderRadius: 1.5,
              px: 3,
              py: 1.2,
            }}
          >
            <Typography
              sx={{ fontSize: 12, color: "#555570", letterSpacing: 1 }}
            >
              Private Beta · Invite Only
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />
      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        <Button
          onClick={() => navigate("/intel")}
          sx={{
            color: "#555570",
            fontSize: 13,
            pl: 0,
            mb: 3,
            "&:hover": { color: "#e8e8f0" },
          }}
        >
          ← Arena Intel
        </Button>

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
            <Button
              onClick={fetchPrediction}
              sx={{ color: "#ff6b6b", ml: 2, fontSize: 12 }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {loading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#ff6b35" }} />
            <Typography sx={{ fontSize: 13, color: "#555570" }}>
              Generating AI analysis... this may take a few seconds
            </Typography>
          </Box>
        )}

        {!loading && match && prediction && (
          <>
            {/* Match header */}
            <Box
              sx={{
                background: "#13131c",
                border: "1px solid #1f1f2e",
                borderTop: "2px solid #ff6b35",
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#ff6b35",
                  mb: 1,
                }}
              >
                {match.competition} · Group {match.groupName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#555570", mb: 2 }}>
                {formatDate(match.matchDate)} · {formatTime(match.matchDate)} ·{" "}
                {match.venue}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography sx={{ fontSize: 48, lineHeight: 1, mb: 1 }}>
                    {match.team1Flag}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    {match.team1}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", px: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 18,
                      color: "#333350",
                    }}
                  >
                    vs
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography sx={{ fontSize: 48, lineHeight: 1, mb: 1 }}>
                    {match.team2Flag}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    {match.team2}
                  </Typography>
                </Box>
              </Box>

              {/* Prediction pills */}
              <Grid container spacing={1.5}>
                {[
                  {
                    label: "Predicted winner",
                    value: prediction.predictedWinner,
                    sub: `${prediction.confidencePercent}% confidence`,
                    color: "#00ffe0",
                  },
                  {
                    label: "Predicted score",
                    value: prediction.predictedScore,
                    sub: "Most likely scoreline",
                    color: "#e8e8f0",
                  },
                  {
                    label: "Risk rating",
                    value: prediction.riskRating,
                    sub: "Prediction certainty",
                    color: RISK_COLOR[prediction.riskRating] ?? "#555570",
                  },
                  {
                    label: "Upset potential",
                    value: `${prediction.upsetPotentialPercent}%`,
                    sub: "Underdog wins",
                    color: "#ff6b35",
                  },
                ].map((pill) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={pill.label}>
                    <Box
                      sx={{
                        background: "#0d0d10",
                        border: "1px solid #1f1f2e",
                        borderRadius: 1.5,
                        p: 1.5,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 9,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          color: "#555570",
                          mb: 0.5,
                        }}
                      >
                        {pill.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 20,
                          fontWeight: 900,
                          color: pill.color,
                          lineHeight: 1,
                        }}
                      >
                        {pill.value}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#555570", mt: 0.5 }}
                      >
                        {pill.sub}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Grid container spacing={2}>
              {/* Left column */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Win probabilities */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Win probabilities
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0,
                        mb: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          flex: prediction.winProbabilities.team1,
                          height: 8,
                          background: "#00ffe0",
                        }}
                      />
                      <Box
                        sx={{
                          flex: prediction.winProbabilities.draw,
                          height: 8,
                          background: "#555570",
                        }}
                      />
                      <Box
                        sx={{
                          flex: prediction.winProbabilities.team2,
                          height: 8,
                          background: "#7b5ef8",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontSize: 11, color: "#00ffe0" }}>
                        {match.team1} {prediction.winProbabilities.team1}%
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#555570" }}>
                        Draw {prediction.winProbabilities.draw}%
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#7b5ef8" }}>
                        {match.team2} {prediction.winProbabilities.team2}%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Recent form */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Recent form — last 5 matches
                    </Typography>
                    {[
                      {
                        team: match.team1,
                        form: prediction.team1Form,
                        details: prediction.team1FormDetails,
                      },
                      {
                        team: match.team2,
                        form: prediction.team2Form,
                        details: prediction.team2FormDetails,
                      },
                    ].map((row) => (
                      <Box key={row.team} sx={{ mb: 2 }}>
                        <Typography
                          sx={{ fontSize: 12, color: "#8888a8", mb: 1 }}
                        >
                          {row.team}
                        </Typography>
                        <Box
                          sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}
                        >
                          {row.form?.map((result, i) => {
                            const style = FORM_COLOR[result] ?? FORM_COLOR.D;
                            return (
                              <Box
                                key={i}
                                title={row.details?.[i] ?? ""}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  background: style.bg,
                                  color: style.color,
                                  border: `1px solid ${style.border}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  cursor: "default",
                                }}
                              >
                                {result}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Head to head */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderLeft: "3px solid #ff6b35",
                      borderRadius: "0 8px 8px 0",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#ff6b35",
                        mb: 1,
                      }}
                    >
                      Head to head
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13, color: "#8888a8", lineHeight: 1.7 }}
                    >
                      {prediction.headToHead}
                    </Typography>
                  </Box>

                  {/* Key insights */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Key insights
                    </Typography>
                    {prediction.keyInsights?.map((insight, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "6px",
                            background: "#00ffe015",
                            border: "1px solid #00ffe030",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: 10, color: "#00ffe0" }}>
                            →
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#8888a8",
                            lineHeight: 1.6,
                          }}
                        >
                          {insight}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Team analysis */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Team analysis
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        {
                          team: match.team1,
                          strengths: prediction.team1Strengths,
                          weaknesses: prediction.team1Weaknesses,
                        },
                        {
                          team: match.team2,
                          strengths: prediction.team2Strengths,
                          weaknesses: prediction.team2Weaknesses,
                        },
                      ].map((t) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={t.team}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#e8e8f0",
                              mb: 1,
                            }}
                          >
                            {t.team}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: "#00ffe0",
                              mb: 0.5,
                              letterSpacing: 1,
                            }}
                          >
                            STRENGTHS
                          </Typography>
                          {t.strengths?.map((s, i) => (
                            <Typography
                              key={i}
                              sx={{
                                fontSize: 12,
                                color: "#8888a8",
                                lineHeight: 1.7,
                              }}
                            >
                              · {s}
                            </Typography>
                          ))}
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: "#ff4444",
                              mb: 0.5,
                              letterSpacing: 1,
                              mt: 1,
                            }}
                          >
                            WEAKNESSES
                          </Typography>
                          {t.weaknesses?.map((w, i) => (
                            <Typography
                              key={i}
                              sx={{
                                fontSize: 12,
                                color: "#8888a8",
                                lineHeight: 1.7,
                              }}
                            >
                              · {w}
                            </Typography>
                          ))}
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* AI match summary */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderTop: "2px solid #7b5ef8",
                      borderRadius: "0 0 8px 8px",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#7b5ef8",
                        mb: 1,
                      }}
                    >
                      AI match summary
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13, color: "#8888a8", lineHeight: 1.8 }}
                    >
                      {prediction.matchSummary}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right sidebar */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Statistical insights */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Statistical insights
                    </Typography>
                    <Grid container spacing={1}>
                      {[
                        {
                          label: "Over/Under",
                          value: `${prediction.overUnder?.line} Goals`,
                          sub: `${prediction.overUnder?.prediction} · ${prediction.overUnder?.overPercent}%`,
                        },
                        {
                          label: "BTTS",
                          value: `${prediction.btts?.prediction}`,
                          sub: `${prediction.btts?.percent}% likely`,
                        },
                        {
                          label: "Corners",
                          value: `${prediction.predictedCorners?.min}–${prediction.predictedCorners?.max}`,
                          sub: "Total predicted",
                        },
                        {
                          label: "Cards",
                          value: `${prediction.predictedCards?.min}–${prediction.predictedCards?.max}`,
                          sub: "Yellow cards",
                        },
                      ].map((stat) => (
                        <Grid size={{ xs: 6 }} key={stat.label}>
                          <Box
                            sx={{
                              background: "#0d0d10",
                              border: "1px solid #1f1f2e",
                              borderRadius: 1.5,
                              p: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 9,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                color: "#555570",
                                mb: 0.5,
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#e8e8f0",
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography sx={{ fontSize: 10, color: "#555570" }}>
                              {stat.sub}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Likely goalscorers */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #1f1f2e",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Likely goalscorers
                    </Typography>
                    {prediction.likelyGoalscorers?.map((scorer, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 1,
                          borderBottom:
                            i < prediction.likelyGoalscorers.length - 1
                              ? "1px solid #1f1f2e"
                              : "none",
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "6px",
                            background: "#7b5ef815",
                            border: "1px solid #7b5ef830",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: 12, color: "#7b5ef8" }}>
                            ⚽
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#e8e8f0",
                            }}
                          >
                            {scorer.name}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: "#555570" }}>
                            {scorer.team} · {scorer.type}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#00ffe0",
                          }}
                        >
                          {scorer.percent}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Suggested combo */}
                  <Box
                    sx={{
                      background: "#13131c",
                      border: "1px solid #7b5ef830",
                      borderTop: "2px solid #7b5ef8",
                      borderRadius: "0 0 8px 8px",
                      p: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#7b5ef8",
                        mb: 1.5,
                      }}
                    >
                      Suggested combo analysis
                    </Typography>
                    {prediction.suggestedCombo?.map((leg, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          py: 0.75,
                          borderBottom:
                            i < prediction.suggestedCombo.length - 1
                              ? "1px solid #1f1f2e"
                              : "none",
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#7b5ef8",
                            flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: 12, color: "#e8e8f0" }}>
                          {leg}
                        </Typography>
                      </Box>
                    ))}
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        background: "#0d0d10",
                        borderRadius: 1,
                        border: "1px solid #1f1f2e",
                      }}
                    >
                      <Typography sx={{ fontSize: 10, color: "#555570" }}>
                        Combined probability
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#7b5ef8",
                        }}
                      >
                        ~{prediction.comboProbabilityPercent}%
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#333350",
                        mt: 1.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {prediction.disclaimer}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
