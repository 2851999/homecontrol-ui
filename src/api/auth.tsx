"use client";

import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { setLoggedIn } from "../authentication";
import { fetchConfig } from "../config";
import { homecontrol_api } from "./api";
import {
  LoginPost,
  User,
  UserPatch,
  UserPost,
  UserSession,
} from "./schemas/auth";

/* Authenticated API that will have intercepts added to handle authentication */
export const authenticated_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOMECONTROL_API_URL,
});

/**
 * Creates a user
 *
 * @param user: User to be posted
 * @returns
 */
export const postUser = (user: UserPost): Promise<User> => {
  return homecontrol_api
    .post(`/auth/user`, user)
    .then((response) => response.data);
};

/**
 * Performs login
 *
 * @param login_data: Data to be posted to login
 * @returns
 */
export const postLogin = (login_data: LoginPost): Promise<UserSession> => {
  return homecontrol_api
    .post(`/auth/login`, login_data, { withCredentials: true })
    .then((response) => response.data);
};

/**
 * Intercept on requests to assign the base url and add the  access token to the header
 */
authenticated_api.interceptors.request.use(
  async (axiosConfig) => {
    const config = await fetchConfig();

    axiosConfig.baseURL = config?.homecontrol_api_url;
    axiosConfig.withCredentials = true;

    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

// See https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c
let isFetchingAccessToken = false;
let accessTokenSubscribers: ((error?: AxiosError) => any)[] = [];

/**
 * Intercept on the response to handle token expiry and refresh
 */
authenticated_api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Request that was just sent
    const originalRequest = error.config;

    // Check if an authentication error (prevent any more than one refresh)
    if (error.response.status === 401 || !originalRequest._retry) {
      // Prevent other requests from also attempting to refresh while waiting
      // for the refresh token response
      if (!isFetchingAccessToken) {
        isFetchingAccessToken = true;

        originalRequest._retry = true;

        try {
          // Attempt to refresh the user session
          await homecontrol_api
            .post(`/auth/refresh`, undefined, {
              withCredentials: true,
            })
            .then((response) => response.data);

          // Re-run any saved requests with the new token
          isFetchingAccessToken = false;
          accessTokenSubscribers.forEach((callback) => callback());
          accessTokenSubscribers = [];

          // Retry
          return axios(originalRequest);
        } catch (error) {
          // Error while refreshing, check if its also a token expiry
          if (isAxiosError(error) && error.response?.status == 401) {
            // Refresh token expired so remove login and go back to login page
            setLoggedIn(false);
            accessTokenSubscribers.forEach((callback) =>
              callback(error as AxiosError)
            );
            accessTokenSubscribers = [];
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      } else {
        // Require refresh but another request is already performing - add to a
        // list to be resolved later once the new token is obtained
        return new Promise((resolve, reject) => {
          accessTokenSubscribers.push((error?: AxiosError) => {
            if (error !== undefined) reject(error);
            else {
              resolve(axios(originalRequest));
            }
          });
        });
      }
    } else return Promise.reject(error);
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
  return authenticated_api.post("/auth/logout").then((response) => {});
};

const fetchUsers = (): Promise<User[]> => {
  return authenticated_api.get("/auth/users").then((response) => response.data);
};

export const useUsers = (): UseQueryResult<User[], AxiosError> => {
  return useQuery<User[], AxiosError>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

const patchUser = (userId: string, userData: UserPatch): Promise<User> => {
  return authenticated_api
    .patch(`/auth/user/${userId}`, userData)
    .then((response) => {
      return response.data;
    });
};

export const useEditUser = (): UseMutationResult<
  User,
  AxiosError,
  { userId: string; userData: UserPatch },
  any
> => {
  return useMutation({
    mutationFn: (data: { userId: string; userData: UserPatch }) =>
      patchUser(data.userId, data.userData),
  });
};

const deleteUser = (userId: string): Promise<void> => {
  return authenticated_api.delete(`/auth/user/${userId}`);
};

export const useDeleteUser = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
