import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getMyProfile, getUserProfile, updateProfile } from "../api/profile";
import type { Profile } from "../api/profile";
import { useAuth } from "../context/AuthContext";

const ROLE_COLOR: Record<string, string> = {
  PLAYER: "#00ffe0",
  ORGANIZER: "#7b5ef8",
  ADMIN: "#ff6b35",
};

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=alpha&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=bravo&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=charlie&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=delta&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=echo&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=foxtrot&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=golf&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=hotel&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=india&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=juliet&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=kilo&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=lima&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=mike&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=november&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=oscar&backgroundColor=0d0d10",
  "https://api.dicebear.com/7.x/bottts/svg?seed=papa&backgroundColor=0d0d10",
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    background: "#0d0d10",
    "& fieldset": { borderColor: "#1f1f2e" },
    "&:hover fieldset": { borderColor: "#555570" },
    "&.Mui-focused fieldset": { borderColor: "#00ffe0" },
  },
  "& .MuiInputLabel-root": { color: "#555570" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#00ffe0" },
  "& .MuiInputBase-input": { color: "#e8e8f0" },
};

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: "", bio: "" });
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const isOwnProfile = !username || username === user?.username;

  useEffect(() => {
    const fetch = isOwnProfile ? getMyProfile() : getUserProfile(username!);
    fetch
      .then((res) => {
        setProfile(res.data.data);
        setEditForm({
          displayName: res.data.data.displayName,
          bio: res.data.data.bio ?? "",
        });
        setSelectedAvatar(res.data.data.avatarUrl);
      })
      .catch(() => setError("Profile not found."))
      .finally(() => setLoading(false));
  }, [username]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await updateProfile({
        displayName: editForm.displayName,
        bio: editForm.bio,
        avatarUrl: selectedAvatar ?? undefined,
      });
      setProfile(res.data.data);
      updateUser({
        displayName: res.data.data.displayName,
        avatarUrl: res.data.data.avatarUrl ?? undefined,
      });
      setSaveMsg("Profile updated!");
      setEditOpen(false);
      setAvatarOpen(false);
    } catch {
      setSaveMsg("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (url: string) => {
    setSelectedAvatar(url);
    setSaving(true);
    try {
      const res = await updateProfile({ avatarUrl: url });
      setProfile(res.data.data);
      updateUser({ avatarUrl: url });
    } catch {
      setSaveMsg("Failed to save avatar.");
    } finally {
      setSaving(false);
      setAvatarOpen(false);
    }
  };

  const joinedDate = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const initials = profile?.displayName?.slice(0, 2).toUpperCase() ?? "??";
  const accentColor = ROLE_COLOR[profile?.role ?? "PLAYER"] ?? "#00ffe0";

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

        {saveMsg && (
          <Alert
            severity={saveMsg.includes("!") ? "success" : "error"}
            sx={{
              mb: 2,
              background: saveMsg.includes("!") ? "#00ffe015" : "#ff000015",
              color: saveMsg.includes("!") ? "#00ffe0" : "#ff6b6b",
              border: `1px solid ${
                saveMsg.includes("!") ? "#00ffe030" : "#ff000030"
              }`,
            }}
          >
            {saveMsg}
          </Alert>
        )}

        {!loading && !error && profile && (
          <>
            {/* Profile hero */}
            <Box
              sx={{
                background: "#13131c",
                border: "1px solid #1f1f2e",
                borderTop: `2px solid ${accentColor}`,
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
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: `${accentColor}15`,
                    border: `2px solid ${accentColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: isOwnProfile ? "pointer" : "default",
                    transition: "border-color 0.2s",
                    "&:hover": isOwnProfile ? { borderColor: accentColor } : {},
                  }}
                  onClick={() => isOwnProfile && setAvatarOpen(true)}
                >
                  {profile.avatarUrl ? (
                    <Box
                      component="img"
                      src={profile.avatarUrl}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 30,
                        fontWeight: 900,
                        color: accentColor,
                      }}
                    >
                      {initials}
                    </Typography>
                  )}
                </Box>
                {isOwnProfile && (
                  <Box
                    onClick={() => setAvatarOpen(true)}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: accentColor,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    ✏️
                  </Box>
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
                    flexWrap: "wrap",
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
                      background: `${accentColor}15`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`,
                      borderRadius: "3px",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 13, color: "#555570", mb: 1 }}>
                  @{profile.username}
                </Typography>
                {profile.bio ? (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#8888a8",
                      lineHeight: 1.6,
                      mb: 1.5,
                      maxWidth: 500,
                    }}
                  >
                    {profile.bio}
                  </Typography>
                ) : isOwnProfile ? (
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#333350",
                      mb: 1.5,
                      fontStyle: "italic",
                    }}
                  >
                    No bio yet — add one to tell people about yourself.
                  </Typography>
                ) : null}
                <Typography sx={{ fontSize: 12, color: "#333350" }}>
                  Joined {joinedDate}
                </Typography>
              </Box>

              {/* Actions */}
              {isOwnProfile && (
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setEditOpen(true)}
                    sx={{
                      fontSize: 12,
                      borderColor: "#00ffe030",
                      color: "#00ffe0",
                      "&:hover": {
                        borderColor: "#00ffe0",
                        background: "#00ffe010",
                      },
                    }}
                  >
                    Edit Profile
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
                  empty: "Host your first tournament!",
                },
                {
                  label: "Tournaments Played",
                  value: profile.tournamentsPlayed,
                  accent: "#00ffe0",
                  empty: "Join a tournament!",
                },
                {
                  label: "Role",
                  value: profile.role,
                  accent: accentColor,
                  empty: null,
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
                  {typeof stat.value === "number" && stat.value === 0 ? (
                    <>
                      <Typography
                        sx={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 36,
                          fontWeight: 900,
                          color: "#1f1f2e",
                          lineHeight: 1,
                          mb: 0.5,
                        }}
                      >
                        0
                      </Typography>
                      {isOwnProfile && stat.empty && (
                        <Typography
                          sx={{ fontSize: 10, color: "#333350", mb: 0.5 }}
                        >
                          {stat.empty}
                        </Typography>
                      )}
                    </>
                  ) : (
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
                  )}
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

            {/* Quick actions — own profile only */}
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

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        PaperProps={{
          sx: {
            background: "#13131c",
            border: "1px solid #1f1f2e",
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 900,
            color: "#fff",
            borderBottom: "1px solid #1f1f2e",
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Display Name"
            value={editForm.displayName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, displayName: e.target.value }))
            }
            sx={{ ...fieldSx, mb: 2.5 }}
          />
          <TextField
            fullWidth
            label="Bio"
            value={editForm.bio}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, bio: e.target.value }))
            }
            multiline
            rows={3}
            placeholder="Tell people about yourself..."
            sx={fieldSx}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1f1f2e", p: 2, gap: 1 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#555570" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Picker Dialog */}
      <Dialog
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        PaperProps={{
          sx: {
            background: "#13131c",
            border: "1px solid #1f1f2e",
            minWidth: 480,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 24,
            fontWeight: 900,
            color: "#fff",
            borderBottom: "1px solid #1f1f2e",
          }}
        >
          Choose Avatar
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ fontSize: 13, color: "#555570", mb: 2 }}>
            Click an avatar to select it instantly.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1.5,
            }}
          >
            {PRESET_AVATARS.map((url, i) => (
              <Box
                key={i}
                onClick={() => handleAvatarSelect(url)}
                sx={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border:
                    selectedAvatar === url
                      ? "2px solid #00ffe0"
                      : "2px solid #1f1f2e",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    selectedAvatar === url ? "0 0 12px #00ffe040" : "none",
                  "&:hover": {
                    borderColor: "#00ffe060",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={url}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1f1f2e", p: 2 }}>
          <Button
            onClick={() => setAvatarOpen(false)}
            sx={{ color: "#555570" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
