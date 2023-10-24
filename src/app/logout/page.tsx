"use client";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { handleLogout, isLoggedIn } from "../../authentication";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  // Go to login page if not logged in
  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, []);

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
