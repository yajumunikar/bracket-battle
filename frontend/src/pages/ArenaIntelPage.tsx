import { useEffect, useState } from "react";
import { Box, Typography, Grid, Chip, Alert, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getIntelMatches } from "../api/intel";

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
  actualWinner: string | null;
}

interface DateGroup {
  date: string;
  matches: MatchDto[];
}

function MatchCardSkeleton() {
  return (
    <Box
      sx={{
        background: "#13131c",
        border: "1px solid #1f1f2e",
        borderTop: "2px solid #1f1f2e",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Skeleton
        variant="text"
        width={140}
        height={14}
        sx={{ bgcolor: "#1f1f2e", mb: 1.5 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ bgcolor: "#1f1f2e", mx: "auto", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={50}
            height={14}
            sx={{ bgcolor: "#1f1f2e", mx: "auto" }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={30}
          height={20}
          sx={{ bgcolor: "#1f1f2e" }}
        />
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ bgcolor: "#1f1f2e", mx: "auto", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={50}
            height={14}
            sx={{ bgcolor: "#1f1f2e", mx: "auto" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: 1,
          borderTop: "1px solid #1f1f2e",
        }}
      >
        <Skeleton
          variant="text"
          width={60}
          height={14}
          sx={{ bgcolor: "#1f1f2e" }}
        />
        <Skeleton
          variant="rounded"
          width={50}
          height={18}
          sx={{ bgcolor: "#1f1f2e" }}
        />
      </Box>
    </Box>
  );
}

export default function ArenaIntelPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState<DateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming">(
    "today"
  );

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;
    fetchMatches();
  }, [isAdmin]);

  const fetchMatches = async () => {
    try {
      const res = await getIntelMatches();
      setGroups(res.data.data);
    } catch {
      setError("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }) + " EST"
    );
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  const isUpcoming = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr >= today;
  };

  const filteredGroups = groups.filter((g) => {
    if (activeTab === "today") return isToday(g.date);
    if (activeTab === "upcoming") return isUpcoming(g.date);
    return true;
  });

  // Locked screen for non-admins
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
            px: 3,
            textAlign: "center",
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

      {/* Hero */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          pt: 5,
          pb: 0,
          borderBottom: "1px solid #1f1f2e",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#ff6b35",
            mb: 0.5,
          }}
        >
          FIFA World Cup 2026 · AI-Powered Analysis
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: { xs: 36, md: 52 },
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          ARENA <span style={{ color: "#00ffe0" }}>INTEL</span>
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#555570", mb: 2 }}>
          Statistical predictions and match analysis · Updated every 6 hours
        </Typography>
        <Box
          sx={{
            background: "#1f1f2e",
            borderRadius: 1,
            px: 2,
            py: 0.8,
            mb: 3,
            display: "inline-block",
          }}
        >
          <Typography sx={{ fontSize: 11, color: "#555570" }}>
            For entertainment purposes only. Not financial or betting advice.
            All predictions are AI-generated statistical estimates.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid #1f1f2e",
            mt: 1,
          }}
        >
          {[
            { key: "today", label: "Today" },
            { key: "upcoming", label: "Upcoming" },
            { key: "all", label: "All Matches" },
          ].map((tab) => (
            <Box
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: activeTab === tab.key ? "#00ffe0" : "#555570",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #00ffe0"
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "color 0.15s",
                "&:hover": { color: "#e8e8f0" },
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
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

        {loading && (
          <Box>
            {[1, 2].map((g) => (
              <Box key={g} sx={{ mb: 4 }}>
                <Skeleton
                  variant="text"
                  width={200}
                  height={16}
                  sx={{ bgcolor: "#1f1f2e", mb: 2 }}
                />
                <Grid container spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <MatchCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {!loading && filteredGroups.length === 0 && (
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
              NO MATCHES FOUND
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#555570" }}>
              {activeTab === "today"
                ? "No matches scheduled for today."
                : "No matches in this range."}
            </Typography>
          </Box>
        )}

        {!loading &&
          filteredGroups.map((group) => (
            <Box key={group.date} sx={{ mb: 5 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#555570",
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid #1f1f2e",
                }}
              >
                {formatDate(group.date)} · Group Stage
              </Typography>

              <Grid container spacing={1.5}>
                {group.matches.map((match) => (
                  <Grid item xs={12} sm={6} md={4} key={match.id}>
                    <Box
                      onClick={() => navigate(`/intel/${match.id}`)}
                      sx={{
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                        borderTop: "2px solid #ff6b35",
                        borderRadius: 2,
                        p: 2.5,
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                        "&:hover": { borderColor: "#ff6b35" },
                      }}
                    >
                      {/* Time and venue */}
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "#555570",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          mb: 1.5,
                        }}
                      >
                        {formatTime(match.matchDate)} ·{" "}
                        {match.venue?.split(",")[0]}
                      </Typography>

                      {/* Teams */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            sx={{ fontSize: 28, lineHeight: 1, mb: 0.5 }}
                          >
                            {match.team1Flag}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#e8e8f0",
                              fontWeight: 500,
                            }}
                          >
                            {match.team1}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", px: 1 }}>
                          {match.actualScore ? (
                            <Typography
                              sx={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontSize: 20,
                                fontWeight: 900,
                                color: "#00ffe0",
                              }}
                            >
                              {match.actualScore}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: 11, color: "#333350" }}>
                              vs
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            sx={{ fontSize: 28, lineHeight: 1, mb: 0.5 }}
                          >
                            {match.team2Flag}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#e8e8f0",
                              fontWeight: 500,
                            }}
                          >
                            {match.team2}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Footer */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 1.5,
                          borderTop: "1px solid #1f1f2e",
                        }}
                      >
                        <Typography sx={{ fontSize: 11, color: "#ff6b35" }}>
                          View Analysis →
                        </Typography>
                        <Chip
                          label={`Group ${match.groupName}`}
                          size="small"
                          sx={{
                            fontSize: 9,
                            height: 18,
                            background: "#1f1f2e",
                            color: "#555570",
                            borderRadius: "3px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
