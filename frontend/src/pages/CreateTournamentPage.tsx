import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGames } from "../api/games";
import type { Game } from "../api/games";
import API from "../api/auth";

const FORMATS = [
  { value: "SINGLE_ELIMINATION", label: "Single Elimination" },
  { value: "DOUBLE_ELIMINATION", label: "Double Elimination" },
  { value: "ROUND_ROBIN", label: "Round Robin" },
];

const MAX_PARTICIPANTS = [4, 8, 16, 32, 64, 128];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    background: "#0d0d10",
    "& fieldset": { borderColor: "#1f1f2e" },
    "&:hover fieldset": { borderColor: "#555570" },
    "&.Mui-focused fieldset": { borderColor: "#00ffe0" },
    "&.Mui-error fieldset": { borderColor: "#ff4444" },
  },
  "& .MuiInputLabel-root": { color: "#555570" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#00ffe0" },
  "& .MuiInputLabel-root.Mui-error": { color: "#ff4444" },
  "& .MuiInputBase-input": { color: "#e8e8f0" },
  "& .MuiSelect-icon": { color: "#555570" },
  "& .MuiFormHelperText-root": { color: "#555570" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ff4444" },
};

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [general, setGeneral] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    gameId: "",
    description: "",
    format: "SINGLE_ELIMINATION",
    maxParticipants: "16",
    prizePool: "",
    prizeDescription: "",
    rules: "",
    entryFee: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    getGames()
      .then((res) => setGames(res.data.data))
      .catch(() => {})
      .finally(() => setGamesLoading(false));
  }, [user, navigate]);

  const set = (field: string) => (e: any) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setGeneral("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload: any = {
        title: form.title,
        gameId: Number(form.gameId),
        description: form.description || undefined,
        format: form.format,
        maxParticipants: Number(form.maxParticipants),
        prizePool: form.prizePool ? Number(form.prizePool) : undefined,
        prizeDescription: form.prizeDescription || undefined,
        rules: form.rules || undefined,
        entryFee: form.entryFee ? Number(form.entryFee) : undefined,
      };
      const res = await API.post("/tournaments", payload);
      setSuccess(true);
      setTimeout(() => navigate(`/tournaments/${res.data.data.id}`), 1200);
    } catch (e: any) {
      const body = e.response?.data;
      if (body?.error === "VALIDATION_ERROR" && body.data) {
        setFieldErrors(body.data);
        setGeneral("Please fix the errors below.");
      } else {
        setGeneral(body?.message ?? "Failed to create tournament. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0d10" }}>
      <Navbar />
      <Box sx={{ px: { xs: 3, md: 6 }, py: 6, maxWidth: 800, mx: "auto" }}>
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
          ← Back to Tournaments
        </Button>

        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#00ffe0",
            mb: 1,
          }}
        >
          Organizer
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            mb: 1,
          }}
        >
          HOST A TOURNAMENT
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#8888a8", mb: 5 }}>
          Fill in the details below. You can publish it when you're ready.
        </Typography>

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              background: "#00ffe015",
              color: "#00ffe0",
              border: "1px solid #00ffe030",
            }}
          >
            Tournament created! Redirecting...
          </Alert>
        )}
        {general && !success && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              background: "#ff000015",
              color: "#ff6b6b",
              border: "1px solid #ff000030",
            }}
          >
            {general}
          </Alert>
        )}

        <Box
          sx={{
            background: "#13131c",
            border: "1px solid #1f1f2e",
            borderTop: "2px solid #00ffe0",
            borderRadius: 2,
            p: { xs: 3, md: 4 },
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
            Basic Info
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.5,
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField
                fullWidth
                label="Tournament Title"
                value={form.title}
                onChange={set("title")}
                error={!!fieldErrors.title}
                helperText={
                  fieldErrors.title || "Give your tournament a memorable name"
                }
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <FormControl fullWidth error={!!fieldErrors.gameId} sx={fieldSx}>
                <InputLabel>Game</InputLabel>
                <Select
                  value={form.gameId}
                  onChange={set("gameId")}
                  label="Game"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                      },
                    },
                  }}
                >
                  {gamesLoading ? (
                    <MenuItem disabled>Loading games...</MenuItem>
                  ) : (
                    games.map((g) => (
                      <MenuItem
                        key={g.id}
                        value={g.id}
                        sx={{
                          color: "#e8e8f0",
                          "&:hover": { background: "#1f1f2e" },
                          "&.Mui-selected": { background: "#00ffe015" },
                        }}
                      >
                        {g.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {fieldErrors.gameId && (
                  <FormHelperText>{fieldErrors.gameId}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box>
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={form.format}
                  onChange={set("format")}
                  label="Format"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                      },
                    },
                  }}
                >
                  {FORMATS.map((f) => (
                    <MenuItem
                      key={f.value}
                      value={f.value}
                      sx={{
                        color: "#e8e8f0",
                        "&:hover": { background: "#1f1f2e" },
                        "&.Mui-selected": { background: "#00ffe015" },
                      }}
                    >
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FormControl
                fullWidth
                error={!!fieldErrors.maxParticipants}
                sx={fieldSx}
              >
                <InputLabel>Max Participants</InputLabel>
                <Select
                  value={form.maxParticipants}
                  onChange={set("maxParticipants")}
                  label="Max Participants"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "#13131c",
                        border: "1px solid #1f1f2e",
                      },
                    },
                  }}
                >
                  {MAX_PARTICIPANTS.map((n) => (
                    <MenuItem
                      key={n}
                      value={n}
                      sx={{
                        color: "#e8e8f0",
                        "&:hover": { background: "#1f1f2e" },
                        "&.Mui-selected": { background: "#00ffe015" },
                      }}
                    >
                      {n} players
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.maxParticipants && (
                  <FormHelperText>{fieldErrors.maxParticipants}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Entry Fee ($)"
                value={form.entryFee}
                onChange={set("entryFee")}
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Leave blank for free entry"
                sx={fieldSx}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Prize Pool ($)"
                value={form.prizePool}
                onChange={set("prizePool")}
                type="number"
                inputProps={{ min: 0, step: 1 }}
                helperText="Total prize pool for winners"
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={set("description")}
                multiline
                rows={3}
                helperText="Tell players what this tournament is about"
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#555570",
              mt: 4,
              mb: 2.5,
            }}
          >
            Prize & Rules
          </Typography>

          <Box sx={{ display: "grid", gap: 2.5 }}>
            <Box>
              <TextField
                fullWidth
                label="Prize Description"
                value={form.prizeDescription}
                onChange={set("prizeDescription")}
                helperText='e.g. "1st: $300, 2nd: $150, 3rd: $50" or "Gaming gear"'
                sx={fieldSx}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Rules"
                value={form.rules}
                onChange={set("rules")}
                multiline
                rows={5}
                helperText="Outline the rules, format details, code of conduct, etc."
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              mt: 4,
              pt: 3,
              borderTop: "1px solid #1f1f2e",
            }}
          >
            <Button
              onClick={() => navigate("/tournaments")}
              sx={{ color: "#555570", "&:hover": { color: "#e8e8f0" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ px: 4, py: 1.2, fontSize: 14, fontWeight: 500 }}
            >
              {submitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "#0d0d10" }} />
                  Creating...
                </Box>
              ) : (
                "Create Tournament"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
