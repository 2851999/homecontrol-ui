"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { handleLogin, isLoggedIn } from "../../authentication";
import { useRouter } from "next/navigation";
import { AuthenticationContext } from "../../components/AuthenticationProvider";

export default function LoginPage() {
  const router = useRouter();

  // User
  const [user, setUser] = useContext(AuthenticationContext);

  // Go to logout page if logged in already
  useEffect(() => {
    if (isLoggedIn()) router.push("/logout");
  }, []);

  // Form parameters
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [longLived, setLongLived] = React.useState<boolean>(true);

  // Additional form parameters
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // Handles when login button pressed
  const handleLoginClicked = async () => {
    await handleLogin(
      {
        username: username,
        password: password,
        long_lived: longLived,
      },
      router,
      setUser,
      (errorResponse) => {
        if (errorResponse.status === 401)
          setErrorMessage(errorResponse.data.detail);
      }
    );
  };

  // Handles when enter key is pressed in either text box
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter") handleLoginClicked();
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
              <Typography variant="h3">Login</Typography>
            </Grid>
            {errorMessage !== undefined && (
              <Grid item>
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              </Grid>
            )}
            <Grid item sx={{ width: "100%" }}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel htmlFor="username-input">Username</InputLabel>
                <OutlinedInput
                  id="username-input"
                  label="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onKeyDown={handleKeyDown}
                ></OutlinedInput>
              </FormControl>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <OutlinedInput
                  id="password-input"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={handleKeyDown}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                ></OutlinedInput>
              </FormControl>
            </Grid>
            <Grid item alignItems="left" sx={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={longLived}
                    onChange={(event) => {
                      setLongLived(event.target.checked);
                    }}
                  />
                }
                label="Remember me?"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleLoginClicked}>
                Login
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
