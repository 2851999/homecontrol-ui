import { createSlice } from "@reduxjs/toolkit";
import { ThemeMode } from "../theme/theme";
import { RootState } from "./store";

export interface SettingsState {
  themeMode: ThemeMode;
}

const initialState: SettingsState = {
  themeMode: (localStorage.getItem("themeMode") as ThemeMode) || "light",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.themeMode == "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newTheme);
      state.themeMode = newTheme;
    },
  },
});

export const { toggleTheme } = settingsSlice.actions;
export const selectThemeMode = (state: RootState) => state.settings.themeMode;
export default settingsSlice.reducer;
