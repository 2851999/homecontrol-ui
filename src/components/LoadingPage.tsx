import { CircularProgress, Grid2 } from "@mui/material";

export interface LoadingPageProps {
  height?: string;
}

/* Displays a progress bar for the whole page  */
export const LoadingPage = (props: LoadingPageProps) => {
  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      sx={{ height: props.height ?? "100vh" }}
    >
      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Grid2>
          <CircularProgress size={100} />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
