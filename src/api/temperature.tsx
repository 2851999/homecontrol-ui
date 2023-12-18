import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { Temperature } from "./schemas/temperature";

const fetchOutdoorTemperature = (): Promise<Temperature> => {
  return authenticated_api
    .get("/temperature/outdoor")
    .then((response) => response.data);
};

export const useOutdoorTemperature = (): UseQueryResult<
  Temperature,
  AxiosError
> => {
  return useQuery<Temperature, AxiosError>({
    queryKey: ["OutdoorTemperature"],
    queryFn: fetchOutdoorTemperature,
  });
};

const fetchRoomTemperature = (roomId: string): Promise<Temperature> => {
  return authenticated_api
    .get(`/temperature/room/${roomId}`)
    .then((response) => response.data);
};

export const useRoomTemperature = (
  roomId: string
): UseQueryResult<Temperature, AxiosError> => {
  return useQuery<Temperature, AxiosError>({
    queryKey: ["RoomTemperature", roomId],
    queryFn: () => fetchRoomTemperature(roomId),
  });
};
