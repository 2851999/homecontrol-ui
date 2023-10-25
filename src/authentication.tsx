"use client";
import axios, { AxiosResponse } from "axios";
import { postLogin, postLogout } from "./api/auth";
import { LoginPost, User, UserSession } from "./api/schemas/auth";
import { AnyARecord } from "dns";

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
