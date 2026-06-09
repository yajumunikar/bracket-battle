import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest, extractErrors } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [general, setGeneral] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setGeneral("");
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      login(res.data.data);
      try {
        const profileRes = await API.get("/users/me");
        updateUser({ avatarUrl: profileRes.data.data.avatarUrl });
      } catch {}
      navigate("/tournaments");
    } catch (e) {
      const { general, fields } = extractErrors(e);
      setGeneral(general);
      setFieldErrors(fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0d0d10",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", marginBottom: 24 }}>
        <Typography
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: 2,
            color: "#fff",
            "& span": { color: "#00ffe0" },
          }}
        >
          BRACKET<span>BATTLE</span>
        </Typography>
      </Link>

      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          background: "#13131c",
          border: "1px solid #1f1f2e",
          borderTop: "2px solid #00ffe0",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#00ffe0",
            mb: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 42,
            fontWeight: 900,
            color: "#fff",
            mb: 3,
          }}
        >
          SIGN IN
        </Typography>

        {general && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              background: "#ff000015",
              color: "#ff6b6b",
              border: "1px solid #ff000030",
            }}
          >
            {general}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={fieldSx("#00ffe0")}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          sx={fieldSx("#00ffe0")}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 3, py: 1.4, fontSize: 15, fontWeight: 500 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <Typography
          sx={{ textAlign: "center", mt: 2.5, fontSize: 13, color: "#555570" }}
        >
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "#00ffe0", textDecoration: "none" }}
          >
            Create one
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

const fieldSx = (accent: string) => ({
  "& .MuiOutlinedInput-root": {
    background: "#0d0d10",
    "& fieldset": { borderColor: "#1f1f2e" },
    "&:hover fieldset": { borderColor: "#555570" },
    "&.Mui-focused fieldset": { borderColor: accent },
    "&.Mui-error fieldset": { borderColor: "#ff4444" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: accent },
  "& .MuiInputLabel-root.Mui-error": { color: "#ff4444" },
  "& .MuiFormHelperText-root": { color: "#555570" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ff4444" },
});
