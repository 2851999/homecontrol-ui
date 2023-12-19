import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";

const discoverHueBridges = (): Promise<HueBridgeDiscoverInfo[]> => {
  return authenticated_api
    .get("/devices/hue/discover")
    .then((response) => response.data);
};

export const useDiscoverHueBridges = (): UseQueryResult<
  HueBridgeDiscoverInfo[],
  AxiosError
> => {
  return useQuery<HueBridgeDiscoverInfo[], AxiosError>({
    queryKey: ["HueBridgesDiscovery"],
    queryFn: discoverHueBridges,
  });
};

const fetchHueBridges = (): Promise<HueBridge[]> => {
  return authenticated_api
    .get("/devices/hue")
    .then((response) => response.data);
};

export const useHueBridges = (): UseQueryResult<HueBridge[], AxiosError> => {
  return useQuery<HueBridge[], AxiosError>({
    queryKey: ["HueBridges"],
    queryFn: fetchHueBridges,
  });
};

const fetchHueBridge = (bridgeId: string): Promise<HueBridge> => {
  return authenticated_api
    .get(`/devices/hue/${bridgeId}`)
    .then((response) => response.data);
};

export const useHueBridge = (
  bridgeId: string
): UseQueryResult<HueBridge, AxiosError> => {
  return useQuery<HueBridge, AxiosError>({
    queryKey: ["HueBridge", bridgeId],
    queryFn: () => fetchHueBridge(bridgeId),
  });
};

// Returns null when waiting for button press
const postHueBridge = (bridge: HueBridgePost): Promise<HueBridge | null> => {
  return authenticated_api.post("/devices/hue", bridge).then((response) => {
    if ("detail" in response.data) return null;
    else return response.data;
  });
};

export const useRegisterHueBridge = (): UseMutationResult<
  HueBridge | null,
  AxiosError,
  HueBridgePost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bridge: HueBridgePost) => {
      return postHueBridge(bridge);
    },
    onSuccess: (response: HueBridge | null) => {
      if (response !== null)
        queryClient.invalidateQueries({ queryKey: ["HueBridges"] });
    },
  });
};

const deleteHueBridge = (bridgeId: string): Promise<void> => {
  return authenticated_api.delete(`/devices/hue/${bridgeId}`);
};

export const useDeleteHueBridge = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bridgeId: string) => {
      return deleteHueBridge(bridgeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["HueBridges"] });
      queryClient.invalidateQueries({ queryKey: ["HueBridgesDiscovery"] });
    },
  });
};

const fetchHueRooms = (bridgeId: string): Promise<HueRoom[]> => {
  return authenticated_api
    .get(`/devices/hue/${bridgeId}/rooms`)
    .then((response) => response.data);
};

export const useHueRooms = (
  bridgeId: string,
  enabled?: boolean
): UseQueryResult<HueRoom[], AxiosError> => {
  return useQuery<HueRoom[], AxiosError>({
    queryKey: ["HueRooms"],
    queryFn: () => fetchHueRooms(bridgeId),
    enabled: enabled ?? true,
  });
};

const fetchHueRoom = (bridgeId: string, roomId: string): Promise<HueRoom> => {
  return authenticated_api
    .get(`/devices/hue/${bridgeId}/rooms/${roomId}`)
    .then((response) => response.data);
};

export const useHueRoom = (
  bridgeId: string,
  roomId: string
): UseQueryResult<HueRoom, AxiosError> => {
  return useQuery<HueRoom, AxiosError>({
    queryKey: ["HueRoom", bridgeId, roomId],
    queryFn: () => fetchHueRoom(bridgeId, roomId),
  });
};

const fetchHueRoomState = (
  bridgeId: string,
  roomId: string
): Promise<HueRoomState> => {
  return authenticated_api
    .get(`/devices/hue/${bridgeId}/rooms/${roomId}/state`)
    .then((response) => response.data);
};

export const useHueRoomState = (
  bridgeId: string,
  roomId: string
): UseQueryResult<HueRoomState, AxiosError> => {
  return useQuery<HueRoomState, AxiosError>({
    queryKey: ["HueRoomState", bridgeId, roomId],
    queryFn: () => fetchHueRoomState(bridgeId, roomId),
  });
};
