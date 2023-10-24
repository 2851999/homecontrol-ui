"use client";
import axios, { isAxiosError } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeUserSession,
  setUserSession,
} from "../authentication";
import { BASE_URL } from "./api";
import { LoginPost, User, UserSession } from "./schemas/auth";

/* Authenticated API that will have intercepts added to handle authentication */
const authenticated_api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Performs login
 *
 * @param login_data: Data to be posted to login
 * @returns
 */
export const postLogin = (login_data: LoginPost): Promise<UserSession> => {
  return axios
    .post(`${BASE_URL}/auth/login`, login_data)
    .then((response) => response.data);
};

/**
 * Intercept on requests to add the access token to the header
 */
authenticated_api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercept on the response to handle token expiry and refresh
 */
authenticated_api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Request that was just sent
    const originalRequest = error.config;

    // Check if an authentication error (prevent any more than one refresh)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the user session
        const refreshToken = getRefreshToken();
        const response: UserSession = await axios
          .post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
          .then((response) => response.data);

        setUserSession(response);
        originalRequest.headers.Authorization = `Bearer ${response.access_token}`;

        // Retry
        return axios(originalRequest);
      } catch (error) {
        // Error while refreshing, check if its also a token expiry
        if (isAxiosError(error) && error.response?.status == 401) {
          // Refresh token expired so remove session and go back to login
          removeUserSession();
          window.location.href = "/login";

          // Return something just to avoid error in then
          return { data: null };
        }
        throw error;
      }
    }
  }
);

export const fetchUser = (): Promise<User> => {
  return authenticated_api.get("/auth/user").then((response) => response.data);
};

/**
 * Performs logout
 *
 * @returns
 */
export const postLogout = (): Promise<void> => {
  return authenticated_api
    .post(`${BASE_URL}/auth/login`)
    .then((response) => {});
};
