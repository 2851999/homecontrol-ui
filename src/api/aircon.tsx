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
  ACDevice,
  ACDevicePost,
  ACDeviceState,
  ACDeviceStatePut,
} from "./schemas/aircon";

const fetchACDevices = (): Promise<ACDevice[]> => {
  return authenticated_api
    .get("/devices/aircon")
    .then((response) => response.data);
};

export const useACDevices = (): UseQueryResult<ACDevice[], AxiosError> => {
  return useQuery<ACDevice[], AxiosError>({
    queryKey: ["ACDevices"],
    queryFn: fetchACDevices,
  });
};

const fetchACDevice = (deviceId: string): Promise<ACDevice> => {
  return authenticated_api
    .get(`/devices/aircon/${deviceId}`)
    .then((response) => response.data);
};

export const useACDevice = (
  deviceId: string
): UseQueryResult<ACDevice, AxiosError> => {
  return useQuery<ACDevice, AxiosError>({
    queryKey: ["ACDevice", deviceId],
    queryFn: () => fetchACDevice(deviceId),
  });
};

const postACDevice = (device: ACDevicePost): Promise<ACDevice> => {
  return authenticated_api
    .post("/devices/aircon", device)
    .then((response) => response.data);
};

export const useAddACDevice = (): UseMutationResult<
  ACDevice,
  AxiosError,
  ACDevicePost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device: ACDevicePost) => postACDevice(device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ACDevices"] });
    },
  });
};

const deleteACDevice = (device_id: string): Promise<void> => {
  return authenticated_api.delete(`/devices/aircon/${device_id}`);
};

export const useDeleteACDevice = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device_id: string) => {
      return deleteACDevice(device_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ACDevices"] });
    },
  });
};

const fetchACDeviceState = (deviceId: string): Promise<ACDeviceState> => {
  return authenticated_api
    .get(`/devices/aircon/${deviceId}/state`)
    .then((response) => response.data);
};

export const useACDeviceState = (
  deviceId: string
): UseQueryResult<ACDeviceState, AxiosError> => {
  return useQuery<ACDeviceState, AxiosError>({
    queryKey: ["ACDeviceState", deviceId],
    queryFn: () => fetchACDeviceState(deviceId),
    // Ignore here for room actions (see TaskSelectStepAC)
    enabled: deviceId !== "",
  });
};

const putACDeviceState = (
  deviceId: string,
  stateData: ACDeviceStatePut
): Promise<ACDeviceState> => {
  return authenticated_api
    .put(`/devices/aircon/${deviceId}/state`, stateData)
    .then((response) => response.data);
};

export const useEditACDeviceState = (
  deviceId: string
): UseMutationResult<ACDeviceState, AxiosError, ACDeviceStatePut, any> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stateData: ACDeviceStatePut) =>
      putACDeviceState(deviceId, stateData),
    onSuccess: (data: ACDeviceState) => {
      queryClient.setQueryData(["ACDeviceState", deviceId], data);
    },
  });
};
