"use client";
import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";
import { handleLogout, isLoggedIn } from "../../authentication";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../components/AuthenticationProvider";

export default function LogoutPage() {
  const router = useRouter();

  const [user, setUser] = useContext(AuthenticationContext);

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
              <Typography variant="h4">Logged in as</Typography>
            </Grid>
            <Grid item textAlign="center" marginTop={2}>
              {user?.username !== undefined && (
                <Avatar sx={{ width: 64, height: 64 }} />
              )}
            </Grid>
            <Grid item textAlign="center" marginBottom={2}>
              <Typography variant="h5" color="secondary">
                {user?.username}
              </Typography>
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
