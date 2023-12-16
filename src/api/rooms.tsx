import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { Room } from "./schemas/rooms";

const fetchRooms = (): Promise<Room[]> => {
  return authenticated_api.get("/rooms").then((response) => response.data);
};

export const useRooms = (): UseQueryResult<Room[], AxiosError> => {
  return useQuery<Room[], AxiosError>({
    queryKey: ["Rooms"],
    queryFn: fetchRooms,
  });
};
