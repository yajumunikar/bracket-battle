import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getMyProfile, getUserProfile } from "../api/profile";
import type { Profile } from "../api/profile";
import { useAuth } from "../context/AuthContext";

const ROLE_COLOR: Record<string, string> = {
  PLAYER: "#00ffe0",
  ORGANIZER: "#7b5ef8",
  ADMIN: "#ff6b35",
};

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = !username || username === user?.username;

  useEffect(() => {
    const fetch = isOwnProfile ? getMyProfile() : getUserProfile(username!);

    fetch
      .then((res) => setProfile(res.data.data))
      .catch(() => setError("Profile not found."))
      .finally(() => setLoading(false));
  }, [username]);

  const joinedDate = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const initials = profile
    ? profile.displayName.slice(0, 2).toUpperCase()
    : "??";

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />

      <Box sx={{ px: { xs: 3, md: 6 }, py: 5, maxWidth: 900, mx: "auto" }}>
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

        {!loading && !error && profile && (
          <>
            {/* Profile hero */}
            <Box
              sx={{
                background: "#13131c",
                border: "1px solid #1f1f2e",
                borderTop: `2px solid ${ROLE_COLOR[profile.role] ?? "#00ffe0"}`,
                borderRadius: 2,
                p: { xs: 3, md: 4 },
                mb: 3,
                display: "flex",
                alignItems: "flex-start",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `${ROLE_COLOR[profile.role] ?? "#00ffe0"}20`,
                  border: `2px solid ${
                    ROLE_COLOR[profile.role] ?? "#00ffe0"
                  }40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {profile.avatarUrl ? (
                  <Box
                    component="img"
                    src={profile.avatarUrl}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 28,
                      fontWeight: 900,
                      color: ROLE_COLOR[profile.role] ?? "#00ffe0",
                    }}
                  >
                    {initials}
                  </Typography>
                )}
              </Box>

              {/* Info */}
              <Box sx={{ flex: 1 }}>
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
                      fontSize: 32,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {profile.displayName}
                  </Typography>
                  <Chip
                    label={profile.role}
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      background: `${ROLE_COLOR[profile.role] ?? "#00ffe0"}15`,
                      color: ROLE_COLOR[profile.role] ?? "#00ffe0",
                      border: `1px solid ${
                        ROLE_COLOR[profile.role] ?? "#00ffe0"
                      }30`,
                      borderRadius: "3px",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 13, color: "#555570", mb: 1 }}>
                  @{profile.username}
                </Typography>
                {profile.bio && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#8888a8",
                      lineHeight: 1.6,
                      mb: 1.5,
                    }}
                  >
                    {profile.bio}
                  </Typography>
                )}
                <Typography sx={{ fontSize: 12, color: "#333350" }}>
                  Joined {joinedDate}
                </Typography>
              </Box>

              {/* Own profile actions */}
              {isOwnProfile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => navigate("/my-tournaments")}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#1f1f2e",
                      color: "#8888a8",
                      fontSize: 12,
                      "&:hover": { borderColor: "#555570", color: "#e8e8f0" },
                    }}
                  >
                    My Tournaments
                  </Button>
                </Box>
              )}
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 1.5,
                mb: 3,
              }}
            >
              {[
                {
                  label: "Tournaments Organized",
                  value: profile.tournamentsOrganized,
                  accent: "#7b5ef8",
                },
                {
                  label: "Tournaments Played",
                  value: profile.tournamentsPlayed,
                  accent: "#00ffe0",
                },
                {
                  label: "Role",
                  value: profile.role,
                  accent: ROLE_COLOR[profile.role] ?? "#00ffe0",
                },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderRadius: 2,
                    p: 2.5,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 36,
                      fontWeight: 900,
                      color: stat.accent,
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#555570",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Quick actions for own profile */}
            {isOwnProfile && (
              <Box
                sx={{
                  background: "#13131c",
                  border: "1px solid #1f1f2e",
                  borderRadius: 2,
                  p: 3,
                }}
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
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/tournaments/create")}
                    sx={{ fontSize: 13, px: 3 }}
                  >
                    + Host Tournament
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/tournaments")}
                    sx={{
                      fontSize: 13,
                      px: 3,
                      borderColor: "#1f1f2e",
                      color: "#8888a8",
                      "&:hover": { borderColor: "#555570", color: "#e8e8f0" },
                    }}
                  >
                    Browse Tournaments
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/my-tournaments")}
                    sx={{
                      fontSize: 13,
                      px: 3,
                      borderColor: "#1f1f2e",
                      color: "#8888a8",
                      "&:hover": { borderColor: "#555570", color: "#e8e8f0" },
                    }}
                  >
                    My Tournaments
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
