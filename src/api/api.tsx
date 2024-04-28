import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { fetchConfig } from "../config";

interface VersionInfo {
  homecontrol_base: string;
  homecontrol_api: string;
}
interface Info {
  version: VersionInfo;
}

export const homecontrol_api = axios.create();

/**
 * Intercept on requests to assign the base url
 */
homecontrol_api.interceptors.request.use(
  async (axiosConfig) => {
    const config = await fetchConfig();

    axiosConfig.baseURL = config?.homecontrol_api_url;
    axiosConfig.withCredentials = true;

    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

const fetchInfo = (): Promise<Info> => {
  return homecontrol_api.get(`/info`).then((response) => response.data);
};

export const useInfo = (): UseQueryResult<Info, AxiosError> => {
  return useQuery<Info, AxiosError>({ queryKey: ["Info"], queryFn: fetchInfo });
};
