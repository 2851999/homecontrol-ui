import { createTheme } from "@mui/material";

export type ThemeMode = "light" | "dark";

export const getTheme = (theme: ThemeMode) => {
  return createTheme({
    palette: {
      mode: theme,
    },
  });
};
