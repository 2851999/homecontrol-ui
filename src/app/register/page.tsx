"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { postUser } from "../../api/auth";
import { UserPost } from "../../api/schemas/auth";
import { isLoggedIn } from "../../authentication";

export default function RegisterPage() {
  const router = useRouter();

  // Go to logout page if logged in already
  useEffect(() => {
    if (isLoggedIn()) router.push("/logout");
  }, []);

  // Form parameters
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>("");

  // Additional form parameters
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState<
    string | undefined
  >(undefined);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRepeatedPassword, setShowRepeatedPassword] =
    React.useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState<
    string | undefined
  >(undefined);
  const [createdAccount, setCreatedAccount] = React.useState<
    "disabled" | "complete" | undefined
  >(undefined);

  // Handles when login button pressed
  const handleCreateClicked = React.useCallback(async () => {
    // Check for any thing else invalid
    username.trim() === "" &&
      setUsernameErrorMessage("Please enter a valid username");
    password.trim() === "" &&
      setPasswordErrorMessage("Please enter a valid password");
    if (username.trim() === "" || password.trim() === "") return;

    if (
      usernameErrorMessage === undefined &&
      passwordErrorMessage === undefined
    ) {
      const user: UserPost = { username: username, password: password };

      try {
        const userResponse = await postUser(user);

        // Notify the user if the created account is disabled
        setErrorMessage(undefined);
        if (!userResponse.enabled) setCreatedAccount("disabled");
        else setCreatedAccount("complete");
      } catch (error) {
        if (isAxiosError(error)) setErrorMessage("Something went wrong...");
      }
    } else setErrorMessage("Please complete the form");
  }, [password, passwordErrorMessage, username, usernameErrorMessage]);

  // Handles when enter key is pressed in any text box
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter") handleCreateClicked();
  };

  // Handles text typed into the username box
  const handleUsernameTyped = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setUsername(event.target.value);

    // Ensure any error message is removed
    if (usernameErrorMessage !== undefined) setUsernameErrorMessage(undefined);
  };

  // Handles text typed into either password box
  const handlePasswordTyped = React.useCallback(
    (
      type: "password" | "repeated_password",
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      // Pass on the typed text
      let other;
      if (type === "password") {
        setPassword(event.target.value);
        other = repeatedPassword;
      } else {
        setRepeatedPassword(event.target.value);
        other = password;
      }
      // Ensure valid and display a message if not
      if (other !== event.target.value)
        setPasswordErrorMessage("Password's don't match");
      else if (passwordErrorMessage !== undefined)
        setPasswordErrorMessage(undefined);
    },
    [password, passwordErrorMessage, repeatedPassword]
  );

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
              <Typography variant="h3">New Account</Typography>
            </Grid>
            {errorMessage !== undefined && (
              <Grid item>
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              </Grid>
            )}
            {createdAccount === "disabled" && (
              <Grid item>
                <Alert variant="filled" severity="info">
                  Account created but disabled. Please contact an admin to be
                  approved. Return to{" "}
                  <Link component={RouterLink} href="/login">
                    login page
                  </Link>
                  .
                </Alert>
              </Grid>
            )}
            {createdAccount === "complete" && (
              <Grid item>
                <Alert variant="filled" severity="success">
                  Account created. Return to{" "}
                  <Link component={RouterLink} href="/login">
                    login page
                  </Link>
                  .
                </Alert>
              </Grid>
            )}
            <Grid item sx={{ width: "100%" }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="username-input">Username</InputLabel>
                <OutlinedInput
                  id="username-input"
                  label="Username"
                  value={username}
                  onChange={handleUsernameTyped}
                  onKeyDown={handleKeyDown}
                  fullWidth
                ></OutlinedInput>
                {usernameErrorMessage !== undefined && (
                  <FormHelperText error>{usernameErrorMessage}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <OutlinedInput
                  id="password-input"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => handlePasswordTyped("password", event)}
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
            <Grid item sx={{ width: "100%" }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="repeated-password-input">
                  Repeated password
                </InputLabel>
                <OutlinedInput
                  id="repeated-password-input"
                  label="Repeated password"
                  type={showRepeatedPassword ? "text" : "password"}
                  value={repeatedPassword}
                  onChange={(event) =>
                    handlePasswordTyped("repeated_password", event)
                  }
                  onKeyDown={handleKeyDown}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowRepeatedPassword(!showRepeatedPassword)
                        }
                      >
                        {showRepeatedPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  fullWidth
                ></OutlinedInput>
                {passwordErrorMessage !== undefined && (
                  <FormHelperText error>{passwordErrorMessage}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleCreateClicked}>
                Create Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
