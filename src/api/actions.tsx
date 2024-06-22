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
  RoomAction,
  RoomActionPatch,
  RoomActionPost,
  TaskType,
} from "./schemas/actions";

const fetchRoomActions = (roomId?: string): Promise<RoomAction[]> => {
  return authenticated_api
    .get("/actions/room", {
      params: { room_id: roomId },
    })
    .then((response) => response.data);
};

export const useRoomActions = (
  roomId?: string
): UseQueryResult<RoomAction[], AxiosError> => {
  return useQuery<RoomAction[], AxiosError>({
    queryKey: ["RoomActions", roomId],
    queryFn: () => fetchRoomActions(roomId),
  });
};

const postRoomAction = (roomAction: RoomActionPost): Promise<RoomAction> => {
  return authenticated_api
    .post("/actions/room", roomAction)
    .then((response) => response.data);
};

export const useAddRoomAction = (): UseMutationResult<
  RoomAction,
  AxiosError,
  RoomActionPost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomAction: RoomActionPost) => postRoomAction(roomAction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomActions"] });
    },
  });
};

const patchRoomAction = (
  action_id: string,
  action: RoomActionPatch
): Promise<RoomAction> => {
  return authenticated_api
    .patch(`/actions/room/${action_id}`, action)
    .then((response) => response.data);
};

export const usePatchRoomAction = (): UseMutationResult<
  RoomAction,
  AxiosError,
  { action_id: string; actionData: RoomActionPatch },
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { action_id: string; actionData: RoomActionPatch }) =>
      patchRoomAction(data.action_id, data.actionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomActions"] });
    },
  });
};

const deleteRoomAction = (actionId: string): Promise<void> => {
  return authenticated_api.delete(`/actions/room/${actionId}`);
};

export const useDeleteRoomAction = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => deleteRoomAction(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomActions"] });
    },
  });
};

const executeRoomAction = (actionId: string): Promise<void> => {
  return authenticated_api.post(`/actions/room/${actionId}`);
};

export const useExecuteRoomAction = (
  action: RoomAction
): UseMutationResult<void, AxiosError, void, any> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => executeRoomAction(action.id),
    onSuccess: () => {
      // Invalidate only what is necessary
      action.tasks.forEach((task) => {
        switch (task.task_type) {
          case TaskType.AC_STATE:
            queryClient.invalidateQueries({
              queryKey: ["ACDeviceState", task.device_id],
            });
            break;
          case TaskType.HUE_SCENE:
            queryClient.invalidateQueries({
              // TODO: Only invalidate for the specific room (information not available here at the moment)
              queryKey: ["HueRoomState", task.bridge_id],
            });
        }
      });
    },
  });
};
