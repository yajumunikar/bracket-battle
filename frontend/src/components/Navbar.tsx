import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "#0d0d10", borderBottom: "1px solid #1f1f2e" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 1,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          BRACKET<span style={{ color: "#00ffe0" }}>BATTLE</span>
        </Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Button
            onClick={() => navigate("/tournaments")}
            sx={{ color: "#8888a8", fontSize: 13 }}
          >
            Tournaments
          </Button>
          <Button sx={{ color: "#8888a8", fontSize: 13 }}>Games</Button>
          {user ? (
            <>
              <Typography sx={{ fontSize: 13, color: "#00ffe0" }}>
                {user.username}
              </Typography>
              <Button
                variant="outlined"
                onClick={logout}
                sx={{
                  borderColor: "#555570",
                  color: "#8888a8",
                  fontSize: 13,
                  px: 2,
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "#00ffe0",
                color: "#00ffe0",
                fontSize: 13,
                px: 2,
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
