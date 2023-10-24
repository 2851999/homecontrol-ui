"use client";
import axios from "axios";
import { postLogin, postLogout } from "./api/auth";
import { LoginPost, UserSession } from "./api/schemas/auth";

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const setUserSession = (userSession: UserSession) => {
  localStorage.setItem("access_token", userSession.access_token);
  localStorage.setItem("refresh_token", userSession.refresh_token);
};

export const removeUserSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("access_token") !== null;
};

/**
 * Attempts to login
 *
 * @param login_data: Login credentials
 * @param onInvalidCredentials: Function to call if the credentials given are
 *                              invalid
 */
export const handleLogin = async (
  login_data: LoginPost,
  router: any,
  onInvalidCredentials: () => void
) => {
  try {
    // Await login
    const response = await postLogin(login_data);
    setUserSession(response);

    // Go to root if successful
    router.push("/");
  } catch (error) {
    // Check for invalid credentials
    if (axios.isAxiosError(error) && error.response?.status === 401)
      onInvalidCredentials();
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
