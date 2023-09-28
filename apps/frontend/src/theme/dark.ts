import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // main: "#000000",
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#42a5f5",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    secondary: {
      // main: "#19857b",
      main: "#ce93d8",
      light: "#f3e5f5",
      dark: "#ab47bc",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#292828",
    },
  },
});
