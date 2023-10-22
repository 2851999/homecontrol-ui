import { createTheme } from "@mui/material";

// Allowed themes
export type ThemeMode = "light" | "dark";

// Returns an MUI theme given the theme mode
export const getTheme = (theme: ThemeMode) => {
  return createTheme({
    palette: {
      mode: theme,
    },
  });
};
