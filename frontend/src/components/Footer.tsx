import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        borderTop: "1px solid #1f1f2e",
        px: { xs: 3, md: 6 },
        py: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: "auto",
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#555570" }}>
        © 2026 Yaju Munikar ·{" "}
        <Box
          component="a"
          href="https://thebracketbattle.com"
          sx={{
            color: "#555570",
            textDecoration: "none",
            "&:hover": { color: "#00ffe0" },
          }}
        >
          thebracketbattle.com
        </Box>
      </Typography>
    </Box>
  );
}
