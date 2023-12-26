import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import {
  BroadlinkAction,
  BroadlinkDeviceRecordPost,
  BroadlinkDevice,
  BroadlinkDevicePlaybackPost,
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

const fetchBroadlinkAction = (actionId: string): Promise<BroadlinkAction> => {
  return authenticated_api
    .get(`/actions/broadlink/${actionId}`)
    .then((response) => response.data);
};

export const useBroadlinkAction = (
  actionId: string
): UseQueryResult<BroadlinkAction, AxiosError> => {
  return useQuery<BroadlinkAction, AxiosError>({
    queryKey: ["BroadlinkAction", actionId],
    queryFn: () => fetchBroadlinkAction(actionId),
  });
};

export const useBroadlinkActionsByIds = (
  actionIds: string[]
): UseQueryResult<BroadlinkAction, AxiosError>[] => {
  return useQueries({
    queries: actionIds.map((actionId) => ({
      queryKey: ["BroadlinkAction", actionId],
      queryFn: () => fetchBroadlinkAction(actionId),
    })),
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

const recordBroadlinkAction = (
  deviceId: string,
  action: BroadlinkDeviceRecordPost
): Promise<BroadlinkAction> => {
  return authenticated_api
    .post(`/devices/broadlink/${deviceId}/record`, action)
    .then((response) => response.data);
};

export const useRecordBroadlinkAction = (): UseMutationResult<
  BroadlinkAction,
  AxiosError,
  { deviceId: string; actionData: BroadlinkDeviceRecordPost },
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      deviceId: string;
      actionData: BroadlinkDeviceRecordPost;
    }) => {
      return recordBroadlinkAction(data.deviceId, data.actionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BroadlinkActions"] });
    },
  });
};

const playbackBroadlinkAction = (
  deviceId: string,
  playbackData: BroadlinkDevicePlaybackPost
): Promise<null> => {
  return authenticated_api
    .post(`/devices/broadlink/${deviceId}/record`, playbackData)
    .then((response) => response.data);
};

export const usePlaybackBroadlinkAction = (
  deviceId: string
): UseMutationResult<null, AxiosError, BroadlinkDevicePlaybackPost, any> => {
  return useMutation({
    mutationFn: (playbackData: BroadlinkDevicePlaybackPost) => {
      return playbackBroadlinkAction(deviceId, playbackData);
    },
  });
};
