import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0d0d10",
      paper: "#13131c",
    },
    primary: {
      main: "#00ffe0",
      contrastText: "#0d0d10",
    },
    secondary: {
      main: "#7b5ef8",
    },
    text: {
      primary: "#e8e8f0",
      secondary: "#8888a8",
    },
    divider: "#1f1f2e",
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 },
    h2: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 },
    h3: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
        body { background-color: #0d0d10; }
      `,
    },
  },
});

export default theme;
