import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { generateWorkoutPlan } from "../api/workout";
import type { WorkoutRequest } from "../api/workout";

const menuProps = {
  PaperProps: {
    sx: { background: "#13131c", border: "1px solid #23232f" },
  },
};

const menuItemSx = {
  color: "#e8e8f0",
  "&:hover": { background: "#1f1f2e" },
  "&.Mui-selected": { background: "rgba(124,106,255,0.15)" },
};

const selectSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#111118",
    color: "#e8e8f0",
    "& fieldset": { borderColor: "#23232f" },
    "&:hover fieldset": { borderColor: "#7c6aff" },
    "&.Mui-focused fieldset": { borderColor: "#7c6aff" },
  },
  "& .MuiInputLabel-root": {
    color: "#6b6b80",
    "&.Mui-focused": { color: "#7c6aff" },
  },
  "& .MuiSelect-icon": { color: "#6b6b80" },
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#111118",
    color: "#e8e8f0",
    "& fieldset": { borderColor: "#23232f" },
    "&:hover fieldset": { borderColor: "#7c6aff" },
    "&.Mui-focused fieldset": { borderColor: "#7c6aff" },
  },
  "& .MuiInputLabel-root": {
    color: "#6b6b80",
    "&.Mui-focused": { color: "#7c6aff" },
  },
  "& .MuiInputBase-input": { color: "#e8e8f0" },
};

const GOALS = [
  { value: "Lose Weight", icon: "🔥", desc: "Burn fat & get lean" },
  { value: "Build Muscle", icon: "💪", desc: "Gain strength & size" },
  { value: "Improve Endurance", icon: "🏃", desc: "Cardio & stamina" },
  { value: "Stay Active", icon: "⚡", desc: "General fitness" },
];

const EQUIPMENT = [
  {
    value: "No Equipment (Bodyweight only)",
    icon: "🧘",
    label: "Bodyweight Only",
  },
  { value: "Dumbbells only", icon: "🏋️", label: "Dumbbells Only" },
  { value: "Resistance Bands", icon: "💢", label: "Resistance Bands" },
  { value: "Full Gym Access", icon: "🏟️", label: "Full Gym Access" },
];

const LEVELS = [
  { value: "Beginner", icon: "🌱" },
  { value: "Intermediate", icon: "⚡" },
  { value: "Advanced", icon: "🔥" },
];

const HEIGHTS = [
  "4'10\"",
  "4'11\"",
  "5'0\"",
  "5'1\"",
  "5'2\"",
  "5'3\"",
  "5'4\"",
  "5'5\"",
  "5'6\"",
  "5'7\"",
  "5'8\"",
  "5'9\"",
  "5'10\"",
  "5'11\"",
  "6'0\"",
  "6'1\"",
  "6'2\"",
  "6'3\"",
  "6'4\"",
  "6'5\"",
];

const SectionCard = ({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) => (
  <Box
    sx={{
      background: "#16161f",
      border: "1px solid #23232f",
      borderRadius: "14px",
      p: 3,
      mb: 3,
      ...sx,
    }}
  >
    {children}
  </Box>
);

const CardLabel = ({
  children,
  color = "#7c6aff",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <Typography
    sx={{
      fontSize: "0.7rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color,
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 0.8,
      "&::before": {
        content: '""',
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
      },
    }}
  >
    {children}
  </Typography>
);

export default function WorkoutPlanPage() {
  const [form, setForm] = useState<WorkoutRequest>({
    goal: "",
    fitnessLevel: "",
    daysPerWeek: 3,
    sessionLength: "45 minutes",
    equipment: "",
    age: undefined,
    weight: undefined,
    weightUnit: "lbs",
    height: "",
    gender: "",
    limitations: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (field: string) => (e: any) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.goal) {
      setError("Please select a goal.");
      return;
    }
    if (!form.fitnessLevel) {
      setError("Please select your fitness level.");
      return;
    }
    if (!form.equipment) {
      setError("Please select your equipment.");
      return;
    }
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generateWorkoutPlan(form);
      setPlan(result);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Generation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!plan) return;
    const blob = new Blob([plan], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout_plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0a0a0f",
        color: "#e8e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 6, md: 9 },
          pb: 4,
          px: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse at center top, rgba(34,201,122,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Chip
          label="💪  AI-Powered · Personalized Plans"
          sx={{
            mb: 3,
            bgcolor: "rgba(34,201,122,0.1)",
            border: "1px solid rgba(34,201,122,0.2)",
            color: "#22c97a",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3.2rem" },
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Your personal{" "}
          <Box component="span" sx={{ color: "#22c97a" }}>
            workout plan
          </Box>
          <br />
          generated in seconds.
        </Typography>
        <Typography
          sx={{
            color: "#6b6b80",
            fontSize: "1rem",
            maxWidth: 480,
            mx: "auto",
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          Tell us about your goals and we'll build a complete weekly plan
          tailored specifically to you.
        </Typography>
      </Box>

      <Box
        sx={{ maxWidth: 860, mx: "auto", px: 3, pb: 6, flex: 1, width: "100%" }}
      >
        <SectionCard>
          <CardLabel color="#22c97a">What's your goal?</CardLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 1.5,
            }}
          >
            {GOALS.map((g) => (
              <Box
                key={g.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setForm((prev) => ({ ...prev, goal: g.value }));
                }}
                sx={{
                  border: `2px solid ${
                    form.goal === g.value ? "#22c97a" : "#23232f"
                  }`,
                  borderRadius: "12px",
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor:
                    form.goal === g.value ? "rgba(34,201,122,0.08)" : "#111118",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#22c97a",
                    bgcolor: "rgba(34,201,122,0.05)",
                  },
                  userSelect: "none",
                }}
              >
                <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>
                  {g.icon}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: form.goal === g.value ? "#22c97a" : "#e8e8f0",
                    mb: 0.3,
                  }}
                >
                  {g.value}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#6b6b80" }}>
                  {g.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>

        <SectionCard>
          <CardLabel>Fitness Level</CardLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
            }}
          >
            {LEVELS.map((l) => (
              <Box
                key={l.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setForm((prev) => ({ ...prev, fitnessLevel: l.value }));
                }}
                sx={{
                  border: `2px solid ${
                    form.fitnessLevel === l.value ? "#7c6aff" : "#23232f"
                  }`,
                  borderRadius: "12px",
                  p: 2.5,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor:
                    form.fitnessLevel === l.value
                      ? "rgba(124,106,255,0.1)"
                      : "#111118",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#7c6aff",
                    bgcolor: "rgba(124,106,255,0.05)",
                  },
                  userSelect: "none",
                }}
              >
                <Typography sx={{ fontSize: "1.6rem", mb: 0.5 }}>
                  {l.icon}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color:
                      form.fitnessLevel === l.value ? "#7c6aff" : "#e8e8f0",
                  }}
                >
                  {l.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>

        <SectionCard>
          <CardLabel>Schedule</CardLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl fullWidth sx={selectSx}>
              <InputLabel>Days per week</InputLabel>
              <Select
                value={form.daysPerWeek}
                label="Days per week"
                onChange={(e) =>
                  setForm({ ...form, daysPerWeek: Number(e.target.value) })
                }
                MenuProps={menuProps}
              >
                {[3, 4, 5, 6].map((d) => (
                  <MenuItem key={d} value={d} sx={menuItemSx}>
                    {d} days / week
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={selectSx}>
              <InputLabel>Session length</InputLabel>
              <Select
                value={form.sessionLength}
                label="Session length"
                onChange={set("sessionLength")}
                MenuProps={menuProps}
              >
                {["30 minutes", "45 minutes", "60 minutes", "90 minutes"].map(
                  (s) => (
                    <MenuItem key={s} value={s} sx={menuItemSx}>
                      {s}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
        </SectionCard>

        <SectionCard>
          <CardLabel>Available Equipment</CardLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 1.5,
            }}
          >
            {EQUIPMENT.map((eq) => (
              <Box
                key={eq.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setForm((prev) => ({ ...prev, equipment: eq.value }));
                }}
                sx={{
                  border: `2px solid ${
                    form.equipment === eq.value ? "#7c6aff" : "#23232f"
                  }`,
                  borderRadius: "12px",
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor:
                    form.equipment === eq.value
                      ? "rgba(124,106,255,0.08)"
                      : "#111118",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#7c6aff",
                    bgcolor: "rgba(124,106,255,0.05)",
                  },
                  userSelect: "none",
                }}
              >
                <Typography sx={{ fontSize: "1.6rem", mb: 0.5 }}>
                  {eq.icon}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: form.equipment === eq.value ? "#7c6aff" : "#e8e8f0",
                    lineHeight: 1.3,
                  }}
                >
                  {eq.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>

        <SectionCard>
          <CardLabel color="#f5c542">
            Personal Details{" "}
            <Box
              component="span"
              sx={{
                color: "#555570",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
                fontSize: "0.7rem",
              }}
            >
              (optional)
            </Box>
          </CardLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Age"
              type="number"
              size="small"
              sx={textFieldSx}
              value={form.age || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <TextField
              label={`Weight (${form.weightUnit})`}
              type="number"
              size="small"
              sx={textFieldSx}
              value={form.weight || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  weight: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <FormControl size="small" fullWidth sx={selectSx}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={form.weightUnit}
                label="Unit"
                onChange={set("weightUnit")}
                MenuProps={menuProps}
              >
                <MenuItem value="lbs" sx={menuItemSx}>
                  lbs
                </MenuItem>
                <MenuItem value="kg" sx={menuItemSx}>
                  kg
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth sx={selectSx}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={form.gender}
                label="Gender"
                onChange={set("gender")}
                MenuProps={menuProps}
              >
                <MenuItem value="" sx={menuItemSx}>
                  Prefer not to say
                </MenuItem>
                <MenuItem value="Male" sx={menuItemSx}>
                  Male
                </MenuItem>
                <MenuItem value="Female" sx={menuItemSx}>
                  Female
                </MenuItem>
                <MenuItem value="Other" sx={menuItemSx}>
                  Other
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl size="small" fullWidth sx={selectSx}>
              <InputLabel>Height</InputLabel>
              <Select
                value={form.height}
                label="Height"
                onChange={set("height")}
                MenuProps={menuProps}
              >
                <MenuItem value="" sx={menuItemSx}>
                  Select height
                </MenuItem>
                {HEIGHTS.map((h) => (
                  <MenuItem key={h} value={h} sx={menuItemSx}>
                    {h}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Injuries or limitations"
              size="small"
              fullWidth
              sx={textFieldSx}
              value={form.limitations}
              onChange={set("limitations")}
              placeholder="e.g. bad knees, no jumping"
            />
          </Box>
        </SectionCard>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,94,108,0.1)",
              color: "#ff5e6c",
              border: "1px solid rgba(255,94,108,0.2)",
            }}
          >
            {error}
          </Alert>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            width: "100%",
            py: 2,
            bgcolor: "#22c97a",
            color: "#0a0a0f",
            fontWeight: 800,
            fontSize: "1rem",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": { bgcolor: "#1aad68", transform: "translateY(-1px)" },
            "&:disabled": { bgcolor: "#23232f", color: "#4a4a5a" },
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <CircularProgress size={18} sx={{ color: "#0a0a0f" }} />
              Building your plan...
            </Box>
          ) : (
            "💪  Generate My Workout Plan"
          )}
        </Button>

        {plan && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ borderTop: "1px solid #23232f", mb: 4 }} />
            <SectionCard sx={{ mb: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                  }}
                >
                  💪 Your Personalized Plan
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={handleCopy}
                    size="small"
                    sx={{
                      bgcolor: copied
                        ? "rgba(34,201,122,0.15)"
                        : "rgba(124,106,255,0.1)",
                      color: copied ? "#22c97a" : "#7c6aff",
                      border: `1px solid ${
                        copied
                          ? "rgba(34,201,122,0.2)"
                          : "rgba(124,106,255,0.2)"
                      }`,
                      textTransform: "none",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                    }}
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    size="small"
                    sx={{
                      bgcolor: "rgba(34,201,122,0.1)",
                      color: "#22c97a",
                      border: "1px solid rgba(34,201,122,0.2)",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                    }}
                  >
                    Download .txt
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: "#111118",
                  border: "1px solid #23232f",
                  borderRadius: "10px",
                  p: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                    lineHeight: 1.9,
                    color: "#e8e8f0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {plan}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  onClick={() => {
                    setPlan(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  sx={{
                    color: "#22c97a",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(34,201,122,0.08)" },
                  }}
                >
                  ← Generate a new plan
                </Button>
              </Box>
            </SectionCard>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
