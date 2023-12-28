import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { HistoricTemperature, Temperature } from "./schemas/temperature";
import dayjs from "dayjs";

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

const fetchHistoricTemperatures = (
  roomName?: string,
  startTimestamp?: Date,
  endTimestamp?: Date
): Promise<HistoricTemperature[]> => {
  return authenticated_api
    .get(`/temperature/historic`, {
      params: {
        room_name: roomName,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
      },
    })
    .then((response) =>
      response.data.map((data: HistoricTemperature) => ({
        ...data,
        timestamp: dayjs(new Date(data.timestamp)),
      }))
    );
};

export const useHistoricTemperatures = (
  roomName?: string,
  startTimestamp?: Date,
  endTimestamp?: Date
): UseQueryResult<HistoricTemperature[], AxiosError> => {
  return useQuery<HistoricTemperature[], AxiosError>({
    queryKey: ["HistoricTemperature", roomName, startTimestamp, endTimestamp],
    queryFn: () =>
      fetchHistoricTemperatures(roomName, startTimestamp, endTimestamp),
  });
};
