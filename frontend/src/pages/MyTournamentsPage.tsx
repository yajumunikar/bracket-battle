import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API from "../api/auth";
import type { Tournament } from "../api/tournaments";

const STATUS_COLOR: Record<string, string> = {
  OPEN: "#00ffe0",
  LOCKED: "#7b5ef8",
  COMPLETED: "#555570",
  DRAFT: "#ff6b35",
  IN_PROGRESS: "#7b5ef8",
  CANCELLED: "#555570",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open",
  LOCKED: "Locked",
  COMPLETED: "Completed",
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  CANCELLED: "Cancelled",
};

export default function MyTournamentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTournament, setMenuTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyTournaments();
  }, [user]);

  const fetchMyTournaments = async () => {
    try {
      const res = await API.get("/tournaments/my");
      setTournaments(res.data.data.content);
    } catch {
      setError("Failed to load your tournaments.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    setActionLoading(id);
    try {
      await API.post(`/tournaments/${id}/publish`);
      setTournaments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "OPEN" } : t))
      );
    } catch (e: any) {
      alert(e.response?.data?.message ?? "Failed to publish.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLock = async (id: number) => {
    setActionLoading(id);
    try {
      await API.post(`/tournaments/${id}/lock`);
      setTournaments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "LOCKED" } : t))
      );
    } catch (e: any) {
      alert(e.response?.data?.message ?? "Failed to lock.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    setActionLoading(id);
    try {
      await API.delete(`/tournaments/${id}`);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      alert(e.response?.data?.message ?? "Failed to delete.");
    } finally {
      setActionLoading(null);
    }
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>, t: Tournament) => {
    setMenuAnchor(e.currentTarget);
    setMenuTournament(t);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuTournament(null);
  };

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
              Organizer Dashboard
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
              MY TOURNAMENTS
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/tournaments/create")}
            sx={{ px: 3, py: 1.3, fontSize: 14, fontWeight: 500, mt: 1 }}
          >
            + New Tournament
          </Button>
        </Box>

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
              Create your first tournament and start competing.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/tournaments/create")}
              sx={{ px: 3, py: 1.3 }}
            >
              Create Tournament
            </Button>
          </Box>
        )}

        {!loading && !error && tournaments.length > 0 && (
          <Grid container spacing={1.5}>
            {tournaments.map((t) => (
              <Grid item xs={12} key={t.id}>
                <Box
                  sx={{
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderLeft: `3px solid ${
                      STATUS_COLOR[t.status] ?? "#555570"
                    }`,
                    borderRadius: 2,
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: STATUS_COLOR[t.status] ?? "#555570",
                    },
                  }}
                >
                  {/* Left — info */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#e8e8f0",
                          cursor: "pointer",
                          "&:hover": { color: "#00ffe0" },
                        }}
                        onClick={() => navigate(`/tournaments/${t.id}`)}
                      >
                        {t.title}
                      </Typography>
                      <Chip
                        label={STATUS_LABEL[t.status] ?? t.status}
                        size="small"
                        sx={{
                          fontSize: 10,
                          height: 20,
                          background: `${
                            STATUS_COLOR[t.status] ?? "#555570"
                          }15`,
                          color: STATUS_COLOR[t.status] ?? "#555570",
                          border: `1px solid ${
                            STATUS_COLOR[t.status] ?? "#555570"
                          }30`,
                          borderRadius: "3px",
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#555570" }}>
                      {t.gameName} · {t.format?.replace("_", " ")} ·{" "}
                      {t.currentParticipants}/{t.maxParticipants} players
                      {t.prizePool
                        ? ` · $${t.prizePool.toLocaleString()} prize pool`
                        : ""}
                    </Typography>
                  </Box>

                  {/* Right — actions */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {t.status === "DRAFT" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        disabled={actionLoading === t.id}
                        onClick={() => handlePublish(t.id)}
                        sx={{ fontSize: 12, px: 2 }}
                      >
                        {actionLoading === t.id ? "..." : "Publish"}
                      </Button>
                    )}
                    {t.status === "OPEN" && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={actionLoading === t.id}
                        onClick={() => handleLock(t.id)}
                        sx={{
                          fontSize: 12,
                          px: 2,
                          borderColor: "#7b5ef8",
                          color: "#7b5ef8",
                          "&:hover": {
                            borderColor: "#9b7ef8",
                            background: "#7b5ef815",
                          },
                        }}
                      >
                        {actionLoading === t.id ? "..." : "Lock"}
                      </Button>
                    )}
                    <Button
                      size="small"
                      onClick={() => navigate(`/tournaments/${t.id}`)}
                      sx={{
                        fontSize: 12,
                        px: 2,
                        color: "#8888a8",
                        "&:hover": { color: "#e8e8f0" },
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      disabled={actionLoading === t.id}
                      onClick={(e) => openMenu(e, t)}
                      sx={{
                        fontSize: 18,
                        px: 1,
                        color: "#555570",
                        minWidth: 32,
                        "&:hover": { color: "#e8e8f0" },
                      }}
                    >
                      ···
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Context menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          PaperProps={{
            sx: {
              background: "#13131c",
              border: "1px solid #1f1f2e",
              minWidth: 160,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate(`/tournaments/${menuTournament?.id}`);
              closeMenu();
            }}
            sx={{
              fontSize: 13,
              color: "#e8e8f0",
              "&:hover": { background: "#1f1f2e" },
            }}
          >
            View Tournament
          </MenuItem>
          {menuTournament?.status === "DRAFT" && (
            <MenuItem
              onClick={() => {
                handlePublish(menuTournament.id);
                closeMenu();
              }}
              sx={{
                fontSize: 13,
                color: "#00ffe0",
                "&:hover": { background: "#1f1f2e" },
              }}
            >
              Publish
            </MenuItem>
          )}
          {menuTournament?.status === "OPEN" && (
            <MenuItem
              onClick={() => {
                handleLock(menuTournament.id);
                closeMenu();
              }}
              sx={{
                fontSize: 13,
                color: "#7b5ef8",
                "&:hover": { background: "#1f1f2e" },
              }}
            >
              Lock Registrations
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              handleDelete(menuTournament!.id);
              closeMenu();
            }}
            sx={{
              fontSize: 13,
              color: "#ff4444",
              "&:hover": { background: "#ff444415" },
            }}
          >
            Delete Tournament
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
