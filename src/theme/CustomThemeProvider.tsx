"use client";
import { useAppSelector } from "..//state/hooks";
import { selectThemeMode } from "../state/settingsSlice";
import ThemeRegistry from "./ThemeRegistry";
import { getTheme } from "./theme";

export default function CustomThemeProvider(props: { children: any }) {
  const { children } = props;
  const theme = getTheme(useAppSelector(selectThemeMode));

  return (
    <ThemeRegistry options={{ key: "mui" }} theme={theme}>
      {children}
    </ThemeRegistry>
  );
}
