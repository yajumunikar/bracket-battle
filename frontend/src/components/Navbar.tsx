import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "#0d0d10", borderBottom: "1px solid #1f1f2e" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Typography
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 1,
            color: "#fff",
          }}
        >
          BRACKET<span style={{ color: "#00ffe0" }}>BATTLE</span>
        </Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Button sx={{ color: "#8888a8", fontSize: 13 }}>Tournaments</Button>
          <Button sx={{ color: "#8888a8", fontSize: 13 }}>Games</Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#00ffe0",
              color: "#00ffe0",
              fontSize: 13,
              px: 2,
            }}
          >
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
