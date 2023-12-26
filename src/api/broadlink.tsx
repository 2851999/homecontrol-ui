import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import {
  BroadlinkAction,
  BroadlinkActionPost,
  BroadlinkDevice,
  BroadlinkDevicePost,
} from "./schemas/broadlink";

const fetchBroadlinkDevices = (): Promise<BroadlinkDevice[]> => {
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

const fetchBroadlinkDevice = (deviceId: string): Promise<BroadlinkDevice> => {
  return authenticated_api
    .get(`/devices/broadlink/${deviceId}`)
    .then((response) => response.data);
};

export const useBroadlinkDevice = (
  deviceId: string
): UseQueryResult<BroadlinkDevice, AxiosError> => {
  return useQuery<BroadlinkDevice, AxiosError>({
    queryKey: ["BroadlinkDevice", deviceId],
    queryFn: () => fetchBroadlinkDevice(deviceId),
  });
};

const postBroadlinkDevice = (
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

const deleteBroadlinkDevice = (device_id: string): Promise<void> => {
  return authenticated_api.delete(`/devices/broadlink/${device_id}`);
};

export const useDeleteBroadlinkDevice = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device_id: string) => {
      return deleteBroadlinkDevice(device_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BroadlinkDevices"] });
    },
  });
};

const fetchBroadlinkActions = (): Promise<BroadlinkAction[]> => {
  return authenticated_api
    .get("/actions/broadlink")
    .then((response) => response.data);
};

export const useBroadlinkActions = (): UseQueryResult<
  BroadlinkAction[],
  AxiosError
> => {
  return useQuery<BroadlinkAction[], AxiosError>({
    queryKey: ["BroadlinkActions"],
    queryFn: fetchBroadlinkActions,
  });
};

const deleteBroadlinkAction = (action_id: string): Promise<void> => {
  return authenticated_api.delete(`/actions/broadlink/${action_id}`);
};

export const useDeleteBroadlinkAction = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device_id: string) => {
      return deleteBroadlinkAction(device_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BroadlinkActions"] });
    },
  });
};

const postBroadlinkAction = (
  action: BroadlinkActionPost
): Promise<BroadlinkAction> => {
  return authenticated_api
    .post("/actions/broadlink", action)
    .then((response) => response.data);
};

export const useAddBroadlinkAction = (): UseMutationResult<
  BroadlinkAction,
  AxiosError,
  BroadlinkActionPost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: BroadlinkActionPost) => {
      return postBroadlinkAction(action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BroadlinkActions"] });
    },
  });
};
