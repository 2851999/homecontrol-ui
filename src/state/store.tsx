import {
  PreloadedState,
  StateFromReducersMapObject,
  configureStore,
} from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { ThemeMode } from "../theme/theme";
import { settingsSlice } from "./settingsSlice";

// All reducers
const reducer = { [settingsSlice.name]: settingsSlice.reducer };

// Store state
export type RootState = StateFromReducersMapObject<typeof reducer>;

/**
 * Makes a store and returns it
 *
 * @param preloadedState - State to initialise the store with
 */
const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: reducer,
    preloadedState: preloadedState,
  });

// More types
type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store["dispatch"];

/**
 * Loads the "settings" part of a Redux store's state from the local storage
 *
 * @returns A pre loaded state or undefined
 */
export const loadFromLocalStorage = ():
  | PreloadedState<RootState>
  | undefined => {
  const serialisedState = localStorage.getItem("settings");
  if (serialisedState !== null) {
    return { settings: JSON.parse(serialisedState) };
  } else return undefined;
};

/**
 * Saves the "settings" part of the Redux state to the local storage
 *
 * @param state - Current Redux store state
 */
export const saveToLocalStorage = (state: RootState) => {
  const serialisedState = JSON.stringify(state.settings);
  localStorage.setItem("settings", serialisedState);
};

/**
 * Custom hook for loading the store from local storage when it is possible to do so
 *
 * @returns Redux store or undefined if not loaded yet
 */
export const useStore = () => {
  // By default initialise without a preloaded state
  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    // In here can guarantee on client
    const newStore = makeStore(loadFromLocalStorage());

    newStore.subscribe(() => saveToLocalStorage(newStore.getState()));
    setStore(newStore);
  }, []);

  return store;
};
