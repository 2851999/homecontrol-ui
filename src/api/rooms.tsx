import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { Room, RoomPost } from "./schemas/rooms";

const fetchRooms = (): Promise<Room[]> => {
  return authenticated_api.get("/rooms").then((response) => response.data);
};

export const useRooms = (): UseQueryResult<Room[], AxiosError> => {
  return useQuery<Room[], AxiosError>({
    queryKey: ["Rooms"],
    queryFn: fetchRooms,
  });
};

const postRoom = (room: RoomPost): Promise<Room> => {
  return authenticated_api
    .post("/rooms", room)
    .then((response) => response.data);
};

export const useAddRoom = (): UseMutationResult<
  Room,
  AxiosError,
  RoomPost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (room: RoomPost) => postRoom(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Rooms"] });
    },
  });
};

const deleteRoom = (roomId: string): Promise<void> => {
  return authenticated_api.delete(`/rooms/${roomId}`);
};

export const useDeleteRoom = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Rooms"] });
    },
  });
};
