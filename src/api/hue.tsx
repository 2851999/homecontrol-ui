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

const deleteHueBridge = (bridge_id: string): Promise<void> => {
  return authenticated_api.delete(`/devices/hue/${bridge_id}`);
};

export const useDeleteHueBridge = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bridge_id: string) => {
      return deleteHueBridge(bridge_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["HueBridges"] });
      queryClient.invalidateQueries({ queryKey: ["HueBridgesDiscovery"] });
    },
  });
};
