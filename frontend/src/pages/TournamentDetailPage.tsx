import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import Navbar from "../components/Navbar";
import {
  getTournament,
  registerForTournament,
  checkRegistration,
  unregisterFromTournament,
} from "../api/tournaments";
import type { Tournament } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR: Record<string, string> = {
  OPEN: "#00ffe0",
  LOCKED: "#7b5ef8",
  COMPLETED: "#555570",
  DRAFT: "#ff6b35",
  IN_PROGRESS: "#7b5ef8",
  CANCELLED: "#555570",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open for Registration",
  LOCKED: "● Live",
  COMPLETED: "Completed",
  DRAFT: "Draft",
  IN_PROGRESS: "● In Progress",
  CANCELLED: "Cancelled",
};

const FORMAT_LABEL: Record<string, string> = {
  SINGLE_ELIMINATION: "Single Elimination",
  DOUBLE_ELIMINATION: "Double Elimination",
  ROUND_ROBIN: "Round Robin",
  SWISS: "Swiss",
};

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getTournament(Number(id))
      .then((res) => setTournament(res.data.data))
      .catch(() => setError("Tournament not found."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    checkRegistration(Number(id))
      .then((res) => setIsRegistered(res.data.data))
      .catch(() => {});
    getTournament(Number(id))
      .then((res) => setTournament(res.data.data))
      .catch(() => {});
  }, [user, id]);

  const handleRegister = async () => {
    if (!user || !id) return;
    setRegLoading(true);
    setRegMessage("");
    try {
      await registerForTournament(Number(id));
      setIsRegistered(true);
      setRegMessage("You are registered!");
      setTournament((prev) =>
        prev
          ? { ...prev, currentParticipants: prev.currentParticipants + 1 }
          : prev
      );
    } catch (e: any) {
      setRegMessage(e.response?.data?.message ?? "Registration failed.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !id) return;
    setRegLoading(true);
    setRegMessage("");
    try {
      await unregisterFromTournament(Number(id));
      setIsRegistered(false);
      setRegMessage("Registration cancelled.");
      setTournament((prev) =>
        prev
          ? { ...prev, currentParticipants: prev.currentParticipants - 1 }
          : prev
      );
    } catch (e: any) {
      setRegMessage(e.response?.data?.message ?? "Failed to unregister.");
    } finally {
      setRegLoading(false);
    }
  };

  const slotsLeft = tournament
    ? tournament.maxParticipants - tournament.currentParticipants
    : 0;
  const fillPct = tournament
    ? Math.round(
        (tournament.currentParticipants / tournament.maxParticipants) * 100
      )
    : 0;

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 12 }}>
          <CircularProgress sx={{ color: "#00ffe0" }} />
        </Box>
      )}

      {error && (
        <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
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
          <Button
            onClick={() => navigate("/tournaments")}
            sx={{ mt: 2, color: "#00ffe0" }}
          >
            ← Back to Tournaments
          </Button>
        </Box>
      )}

      {!loading && !error && tournament && (
        <>
          <Box
            sx={{
              px: { xs: 3, md: 6 },
              py: 6,
              borderBottom: "1px solid #1f1f2e",
              background: `linear-gradient(to bottom, ${
                STATUS_COLOR[tournament.status] ?? "#555570"
              }10 0%, transparent 100%)`,
            }}
          >
            <Button
              onClick={() => navigate("/tournaments")}
              sx={{
                color: "#555570",
                fontSize: 13,
                mb: 3,
                pl: 0,
                "&:hover": { color: "#e8e8f0" },
              }}
            >
              ← All Tournaments
            </Button>

            <Button
              onClick={() => navigate(`/tournaments/${id}/bracket`)}
              variant="outlined"
              sx={{
                borderColor: "#00ffe0",
                color: "#00ffe0",
                fontSize: 12,
                mb: 3,
                ml: 1,
                "&:hover": { background: "#00ffe015" },
              }}
            >
              View Bracket
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#555570",
                    }}
                  >
                    {tournament.gameName}
                  </Typography>
                  <Chip
                    label={STATUS_LABEL[tournament.status] ?? tournament.status}
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      background: `${
                        STATUS_COLOR[tournament.status] ?? "#555570"
                      }15`,
                      color: STATUS_COLOR[tournament.status] ?? "#555570",
                      border: `1px solid ${
                        STATUS_COLOR[tournament.status] ?? "#555570"
                      }30`,
                      borderRadius: "3px",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: { xs: 36, md: 52 },
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    mb: 1.5,
                  }}
                >
                  {tournament.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#8888a8",
                    maxWidth: 560,
                    lineHeight: 1.7,
                  }}
                >
                  {tournament.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  background: "#13131c",
                  border: "1px solid #1f1f2e",
                  borderTop: `2px solid ${
                    STATUS_COLOR[tournament.status] ?? "#555570"
                  }`,
                  borderRadius: 2,
                  p: 3,
                  minWidth: 220,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#555570",
                    letterSpacing: 1,
                    mb: 0.5,
                  }}
                >
                  Prize Pool
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 38,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {tournament.prizePool
                    ? `$${tournament.prizePool.toLocaleString()}`
                    : "Free"}
                </Typography>
                {tournament.prizeDescription && (
                  <Typography sx={{ fontSize: 11, color: "#555570", mb: 2 }}>
                    {tournament.prizeDescription}
                  </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.75,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#555570" }}>
                      {tournament.currentParticipants} /{" "}
                      {tournament.maxParticipants} players
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#555570" }}>
                      {slotsLeft} slots left
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      background: "#1f1f2e",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        width: `${fillPct}%`,
                        background:
                          STATUS_COLOR[tournament.status] ?? "#555570",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>

                {isRegistered && !regMessage && (
                  <Typography
                    sx={{
                      fontSize: 12,
                      mb: 1.5,
                      textAlign: "center",
                      color: "#00ffe0",
                    }}
                  >
                    You are registered!
                  </Typography>
                )}
                {regMessage && (
                  <Typography
                    sx={{
                      fontSize: 12,
                      mb: 1.5,
                      textAlign: "center",
                      color: regMessage.includes("registered")
                        ? "#00ffe0"
                        : "#ff6b6b",
                    }}
                  >
                    {regMessage}
                  </Typography>
                )}

                {tournament.status === "OPEN" ? (
                  user ? (
                    isRegistered ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleUnregister}
                        disabled={regLoading}
                        sx={{
                          py: 1.3,
                          fontSize: 14,
                          borderColor: "#ff4444",
                          color: "#ff4444",
                          "&:hover": {
                            borderColor: "#ff6666",
                            background: "#ff444415",
                          },
                        }}
                      >
                        {regLoading ? "Processing..." : "Withdraw Registration"}
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        disabled={regLoading}
                        sx={{ py: 1.3, fontSize: 14, fontWeight: 500 }}
                      >
                        {regLoading ? "Registering..." : "Register Now"}
                      </Button>
                    )
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/login")}
                      sx={{ py: 1.3, fontSize: 14, fontWeight: 500 }}
                    >
                      Sign In to Register
                    </Button>
                  )
                ) : (
                  <Button
                    fullWidth
                    disabled
                    sx={{
                      py: 1.3,
                      fontSize: 14,
                      background: "#1f1f2e",
                      color: "#555570",
                    }}
                  >
                    {tournament.status === "DRAFT"
                      ? "Not Open Yet"
                      : tournament.status === "LOCKED"
                      ? "Registration Closed"
                      : "Tournament Ended"}
                  </Button>
                )}

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#555570",
                    textAlign: "center",
                    mt: 1.5,
                  }}
                >
                  Hosted by {tournament.organizerUsername}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={1.5} sx={{ mb: 4 }}>
                  {[
                    {
                      label: "Format",
                      value:
                        FORMAT_LABEL[tournament.format] ?? tournament.format,
                    },
                    {
                      label: "Type",
                      value: tournament.tournamentType?.replace("_", " "),
                    },
                    {
                      label: "Entry Fee",
                      value: tournament.entryFee
                        ? `$${tournament.entryFee}`
                        : "Free",
                    },
                    { label: "Max Players", value: tournament.maxParticipants },
                  ].map((stat) => (
                    <Grid item xs={6} sm={3} key={stat.label}>
                      <Box
                        sx={{
                          background: "#13131c",
                          border: "1px solid #1f1f2e",
                          borderRadius: 2,
                          p: 2,
                          textAlign: "center",
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
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#e8e8f0",
                          }}
                        >
                          {stat.value ?? "—"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {tournament.rules && (
                  <>
                    <Typography
                      sx={{
                        fontSize: 11,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Rules
                    </Typography>
                    <Box
                      sx={{
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                        borderRadius: 2,
                        p: 3,
                        mb: 4,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "#8888a8",
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {tournament.rules}
                      </Typography>
                    </Box>
                  </>
                )}

                {(tournament.startDate || tournament.endDate) && (
                  <>
                    <Typography
                      sx={{
                        fontSize: 11,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: "#555570",
                        mb: 2,
                      }}
                    >
                      Schedule
                    </Typography>
                    <Box
                      sx={{
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                        borderRadius: 2,
                        p: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 6 }}>
                        {tournament.startDate && (
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 10,
                                color: "#555570",
                                letterSpacing: 1,
                                mb: 0.5,
                              }}
                            >
                              Starts
                            </Typography>
                            <Typography sx={{ fontSize: 15, color: "#e8e8f0" }}>
                              {new Date(
                                tournament.startDate
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Typography>
                          </Box>
                        )}
                        {tournament.endDate && (
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 10,
                                color: "#555570",
                                letterSpacing: 1,
                                mb: 0.5,
                              }}
                            >
                              Ends
                            </Typography>
                            <Typography sx={{ fontSize: 15, color: "#e8e8f0" }}>
                              {new Date(tournament.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "#555570",
                    mb: 2,
                  }}
                >
                  Participants
                </Typography>
                <Box
                  sx={{
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  {tournament.currentParticipants === 0 ? (
                    <>
                      <Typography
                        sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 42,
                          fontWeight: 900,
                          color: "#1f1f2e",
                          lineHeight: 1,
                        }}
                      >
                        0
                      </Typography>
                      <Typography
                        sx={{ fontSize: 13, color: "#555570", mt: 1 }}
                      >
                        No participants yet. Be the first!
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 42,
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {tournament.currentParticipants}
                      <Box
                        component="span"
                        sx={{
                          fontSize: 16,
                          color: "#555570",
                          fontFamily: "inherit",
                        }}
                      >
                        /{tournament.maxParticipants}
                      </Box>
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
