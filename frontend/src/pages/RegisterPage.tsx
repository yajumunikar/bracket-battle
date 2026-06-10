import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest, extractErrors } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [general, setGeneral] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    setGeneral("");
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await registerRequest(username, email, password);
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
          borderTop: "2px solid #7b5ef8",
          borderRadius: 2,
          p: 4,
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#555570",
            "&:hover": { color: "#e8e8f0", background: "#1f1f2e" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7b5ef8",
            mb: 1,
          }}
        >
          Join the Arena
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
          CREATE ACCOUNT
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
          label="Username"
          value={username}
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          error={!!fieldErrors.username}
          helperText={fieldErrors.username}
          sx={fieldSx("#7b5ef8")}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={fieldSx("#7b5ef8")}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password || "Minimum 8 characters"}
          sx={fieldSx("#7b5ef8")}
          margin="normal"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "#555570", "&:hover": { color: "#7b5ef8" } }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.4,
            fontSize: 15,
            fontWeight: 500,
            background: "#7b5ef8",
            color: "#fff",
            "&:hover": { background: "#6a4de0" },
          }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <Typography
          sx={{ textAlign: "center", mt: 2.5, fontSize: 13, color: "#555570" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#00ffe0", textDecoration: "none" }}
          >
            Sign in
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
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #0d0d10 inset",
      WebkitTextFillColor: "#e8e8f0",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: accent },
  "& .MuiInputLabel-root.Mui-error": { color: "#ff4444" },
  "& .MuiFormHelperText-root": { color: "#555570" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ff4444" },
});
