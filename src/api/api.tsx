import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface VersionInfo {
  homecontrol_base: string;
  homecontrol_api: string;
}
interface Info {
  version: VersionInfo;
}

export const homecontrol_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOMECONTROL_API_URL,
});

const fetchInfo = (): Promise<Info> => {
  return homecontrol_api.get(`/info`).then((response) => response.data);
};

export const useInfo = (): UseQueryResult<Info, AxiosError> => {
  return useQuery<Info, AxiosError>({ queryKey: ["Info"], queryFn: fetchInfo });
};
