"use client";
import { CircularProgress, Grid } from "@mui/material";
import { Provider } from "react-redux";
import { useStore } from "./store";

/* Provides a redux store - Displays a progress bar while loading data from
  local storage before allowing anything to be rendered */
export const CustomStoreProvider = (props: {
  waitToLoad: boolean;
  children: any;
}) => {
  const { waitToLoad, children } = props;
  const store = useStore(!waitToLoad);

  return store === undefined ? (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      sx={{ height: "100vh" }}
    >
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Grid item>
          <CircularProgress size={100} />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Provider store={store}>{children}</Provider>
  );
};
