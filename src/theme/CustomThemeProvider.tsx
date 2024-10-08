"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { useAppSelector } from "..//state/hooks";
import { themeModeSelector } from "../state/settingsSlice";
import { getTheme } from "./theme";

/**
 * Provides the current theme using redux and uses an emotion cache provider as
 * https://mui.com/material-ui/guides/next-js-app-router/
 */
export default function CustomThemeProvider(props: { children: any }) {
  const { children } = props;
  const theme = getTheme(useAppSelector(themeModeSelector));

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
