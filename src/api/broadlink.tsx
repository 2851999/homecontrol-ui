import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { BroadlinkDevice, BroadlinkDevicePost } from "./schemas/broadlink";

export const fetchBroadlinkDevices = (): Promise<BroadlinkDevice[]> => {
  return authenticated_api
    .get("/devices/broadlink")
    .then((response) => response.data);
};

export const useBroadlinkDevices = (): UseQueryResult<
  BroadlinkDevice[],
  AxiosError
> => {
  return useQuery<BroadlinkDevice[], AxiosError>({
    queryKey: ["BroadlinkDevices"],
    queryFn: fetchBroadlinkDevices,
  });
};

export const postBroadlinkDevice = (
  device: BroadlinkDevicePost
): Promise<BroadlinkDevice> => {
  return authenticated_api
    .post("/devices/broadlink", device)
    .then((response) => response.data);
};

export const useAddBroadlinkDevice = (): UseMutationResult<
  BroadlinkDevice,
  AxiosError,
  BroadlinkDevicePost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device: BroadlinkDevicePost) => {
      return postBroadlinkDevice(device);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BroadlinkDevices"] });
    },
  });
};
