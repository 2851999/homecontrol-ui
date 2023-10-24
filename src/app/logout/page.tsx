"use client";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { handleLogout } from "../../authentication";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogoutClicked = async () => {
    await handleLogout(router);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Paper sx={{ padding: 4 }}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item textAlign="center">
              <Typography variant="h3">Logout</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleLogoutClicked}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
