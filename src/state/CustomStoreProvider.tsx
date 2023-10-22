"use client";
import { CircularProgress, Grid } from "@mui/material";
import { Provider } from "react-redux";
import { useStore } from "./store";

/* Provides a redux store - Displays a progress bar while loading data from
  local storage before allowing anything to be rendered */
export const CustomStoreProvider = (props: { children: any }) => {
  const { children } = props;
  const store = useStore();

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
