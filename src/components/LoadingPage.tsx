import { CircularProgress, Grid } from "@mui/material";

/* Displays a progress bar for the whole page  */
export const LoadingPage = () => {
  return (
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
  );
};
