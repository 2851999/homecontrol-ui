"use client";

import axios, { AxiosResponse } from "axios";
import { postLogin, postLogout } from "./api/auth";
import { LoginPost, User, UserSession } from "./api/schemas/auth";

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const setUserSession = (userSession: UserSession) => {
  localStorage.setItem("logged_in", "true");
};

export const removeUserSession = () => {
  localStorage.removeItem("logged_in");
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
    const response = await postLogin(login_data);
    setUserSession(response);

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

  // Remove tokens
  removeUserSession();

  // Return to login
  router.push("/login");
};
