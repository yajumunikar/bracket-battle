import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const avatarSrc = user?.avatarUrl ?? null;
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

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
          <Button
            onClick={() => navigate("/games")}
            sx={{ color: "#8888a8", fontSize: 13 }}
          >
            Games
          </Button>

          {user ? (
            <>
              <Button
                onClick={() => navigate("/my-tournaments")}
                sx={{ color: "#8888a8", fontSize: 13 }}
              >
                My Tournaments
              </Button>

              {/* Profile button */}
              <Box
                onClick={openMenu}
                title="View Profile"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  border: "1px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    border: "1px solid #00ffe030",
                    background: "#00ffe008",
                    boxShadow: "0 0 12px #00ffe015",
                  },
                }}
              >
                {/* Avatar circle */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#00ffe020",
                    border: "1.5px solid #00ffe040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {avatarSrc ? (
                    <Box
                      component="img"
                      src={avatarSrc}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#00ffe0",
                        lineHeight: 1,
                      }}
                    >
                      {initials}
                    </Typography>
                  )}
                </Box>
                <Typography
                  sx={{ fontSize: 13, color: "#00ffe0", fontWeight: 500 }}
                >
                  {user.username}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#555570", mt: "1px" }}>
                  ▾
                </Typography>
              </Box>

              {/* Dropdown menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                PaperProps={{
                  sx: {
                    background: "#13131c",
                    border: "1px solid #1f1f2e",
                    borderTop: "2px solid #00ffe0",
                    minWidth: 180,
                    mt: 1,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* Profile header in menu */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #1f1f2e" }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}
                  >
                    {user.username}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#555570" }}>
                    {user.role}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    closeMenu();
                  }}
                  sx={{
                    fontSize: 13,
                    color: "#e8e8f0",
                    py: 1.25,
                    "&:hover": { background: "#1f1f2e" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Typography sx={{ fontSize: 14 }}>👤</Typography>
                  </ListItemIcon>
                  View Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/my-tournaments");
                    closeMenu();
                  }}
                  sx={{
                    fontSize: 13,
                    color: "#e8e8f0",
                    py: 1.25,
                    "&:hover": { background: "#1f1f2e" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Typography sx={{ fontSize: 14 }}>🏆</Typography>
                  </ListItemIcon>
                  My Tournaments
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/tournaments/create");
                    closeMenu();
                  }}
                  sx={{
                    fontSize: 13,
                    color: "#e8e8f0",
                    py: 1.25,
                    "&:hover": { background: "#1f1f2e" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Typography sx={{ fontSize: 14 }}>➕</Typography>
                  </ListItemIcon>
                  Host Tournament
                </MenuItem>

                <Divider sx={{ borderColor: "#1f1f2e", my: 0.5 }} />

                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                    closeMenu();
                  }}
                  sx={{
                    fontSize: 13,
                    color: "#ff4444",
                    py: 1.25,
                    "&:hover": { background: "#ff444410" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Typography sx={{ fontSize: 14 }}>🚪</Typography>
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
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
