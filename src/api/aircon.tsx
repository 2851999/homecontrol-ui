import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { ACDevice, ACDevicePost } from "./schemas/aircon";

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
    mutationFn: (device: ACDevicePost) => {
      return postACDevice(device);
    },
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
