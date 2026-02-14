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
  Link,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { handleLogin, isLoggedIn } from "../../authentication";
import { AuthenticationContext } from "../../components/AuthenticationProvider";

export default function LoginPage() {
  const router = useRouter();

  // User
  const [user, setUser] = useContext(AuthenticationContext);

  // Go to logout page if logged in already
  useEffect(() => {
    if (isLoggedIn()) router.replace("/logout");
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
    if (setUser) {
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
    }
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
      <Grid>
        <Paper sx={{ padding: 4 }}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid textAlign="center">
              <Typography variant="h3">Login</Typography>
            </Grid>
            {errorMessage !== undefined && (
              <Grid>
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              </Grid>
            )}
            <Grid sx={{ width: "100%" }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="username-input">Username</InputLabel>
                <OutlinedInput
                  id="username-input"
                  label="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onKeyDown={handleKeyDown}
                  fullWidth
                ></OutlinedInput>
              </FormControl>
            </Grid>
            <Grid sx={{ width: "100%" }}>
              <FormControl variant="outlined" fullWidth>
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
                  fullWidth
                ></OutlinedInput>
              </FormControl>
            </Grid>
            <Grid alignItems="left" sx={{ width: "100%" }}>
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
            <Grid textAlign="center" sx={{ width: "100%", mb: 1 }}>
              <Link component={RouterLink} href="/register">
                Create an account
              </Link>
            </Grid>
            <Grid>
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
