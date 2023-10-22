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

export const useStore = () => {
  const [store, setStore] = useState(makeStore());

  useEffect(() => {
    // In here can guarantee on client
    setStore(
      makeStore({
        settings: {
          themeMode:
            (localStorage.getItem("themeMode") as ThemeMode) || "light",
        },
      })
    );
  }, []);

  return store;
};

type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store["dispatch"];
