import { createSlice } from "@reduxjs/toolkit";
import { ThemeMode } from "../theme/theme";
import { RootState } from "./store";

/**
 * Settings to store in the redux store
 */
export interface Settings {
  themeMode: ThemeMode;
}

/**
 * Default state
 */
const initialState: Settings = {
  themeMode: "light",
};

/**
 * Redux slice
 */
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.themeMode == "light" ? "dark" : "light";
      state.themeMode = newTheme;
    },
  },
});

/**
 * @param toggleTheme - Toggles the theme between light and dark
 */
export const { toggleTheme } = settingsSlice.actions;

// Selectors
export const selectThemeMode = (state: RootState) => state.settings.themeMode;

// Reducer
export default settingsSlice.reducer;
