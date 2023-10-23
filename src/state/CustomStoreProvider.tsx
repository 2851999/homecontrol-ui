"use client";
import { Provider } from "react-redux";
import { useStore } from "./store";
import { LoadingPage } from "../components/LoadingPage";

/**
 * Provides a redux store - Displays a progress bar while loading data from
 * local storage before allowing anything to be rendered
 *
 * @param props.waitToLoad: Whether to wait for the storage to be loaded from
 *                          local storage before rendering
 * @returns
 */
export const CustomStoreProvider = (props: {
  waitToLoad: boolean;
  children: any;
}) => {
  const { waitToLoad, children } = props;
  const store = useStore(!waitToLoad);

  return store === undefined ? (
    <LoadingPage />
  ) : (
    <Provider store={store}>{children}</Provider>
  );
};
