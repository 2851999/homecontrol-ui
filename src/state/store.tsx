import {
  PreloadedState,
  StateFromReducersMapObject,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ThemeMode } from "../theme/theme";
import { settingsSlice } from "./settingsSlice";

const reducer = { settings: settingsSlice.reducer };

export type RootState = StateFromReducersMapObject<typeof reducer>;

const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: reducer,
    preloadedState: preloadedState,
  });

export const loadFromLocalStorage = (): PreloadedState<RootState> | null => {
  const serialisedState = localStorage.getItem("settings");
  if (serialisedState !== null) {
    return { settings: JSON.parse(serialisedState) };
  } else return null;
};

export const saveToLocalStorage = (state: RootState) => {
  const serialisedState = JSON.stringify(state.settings);
  localStorage.setItem("settings", serialisedState);
};

export const useStore = () => {
  const [store, setStore] = useState(makeStore());

  useEffect(() => {
    // In here can guarantee on client
    const newStore = makeStore({
      settings: {
        themeMode: (localStorage.getItem("themeMode") as ThemeMode) || "light",
      },
    });

    newStore.subscribe(() => saveToLocalStorage(newStore.getState()));
    setStore(newStore);
  }, []);

  return store;
};

type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store["dispatch"];
