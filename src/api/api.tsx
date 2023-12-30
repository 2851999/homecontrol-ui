import { UseQueryResult, useQuery } from "@tanstack/react-query";
import config_dev from "../../config-dev.json";
import config_prod from "../../config-prod.json";
import axios, { AxiosError } from "axios";

let config = config_prod;
if (process.env.NEXT_PUBLIC_CONFIG_ENV == "dev") config = config_dev;

export const BASE_URL = config.API_BASE_URL;

interface VersionInfo {
  homecontrol_base: string;
  homecontrol_api: string;
}
interface Info {
  version: VersionInfo;
}

const fetchInfo = (): Promise<Info> => {
  return axios.get(`${BASE_URL}/info`).then((response) => response.data);
};

export const useInfo = (): UseQueryResult<Info, AxiosError> => {
  return useQuery<Info, AxiosError>({ queryKey: ["Info"], queryFn: fetchInfo });
};
