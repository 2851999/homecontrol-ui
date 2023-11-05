import { CircularProgress, Grid } from "@mui/material";

export interface LoadingPageProps {
  height?: string;
}

/* Displays a progress bar for the whole page  */
export const LoadingPage = (props: LoadingPageProps) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      sx={{ height: props.height ?? "100vh" }}
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
