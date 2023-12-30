"use client";

import axios, { AxiosResponse } from "axios";
import { postLogin, postLogout } from "./api/auth";
import { LoginPost, User, UserSession } from "./api/schemas/auth";

export const setLoggedIn = (value: boolean) => {
  if (value) localStorage.setItem("logged_in", "true");
  else localStorage.removeItem("logged_in");
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("logged_in") === "true";
};

/**
 * Attempts to login
 *
 * @param login_data: Login credentials
 * @param onErrorResponse: Function to call if an error response is given
 */
export const handleLogin = async (
  login_data: LoginPost,
  router: any,
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>,
  onErrorResponse: (errorResponse: AxiosResponse<any, any>) => void
) => {
  try {
    // Await login
    await postLogin(login_data);
    setLoggedIn(true);

    // Set the user to start loading
    setUser(null);

    // Go to root if successful
    router.push("/");
  } catch (error) {
    // Check for invalid credentials
    if (axios.isAxiosError(error) && error.response)
      onErrorResponse(error.response);
  }
};

/**
 * Attempts to logout
 */
export const handleLogout = async (router: any) => {
  // Notify backend
  await postLogout();

  // Remove from local storage
  setLoggedIn(false);

  // Return to login
  router.push("/login");
};
