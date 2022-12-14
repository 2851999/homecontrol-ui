import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';

import { API_BASE_URL, API_HEADER } from './HomeControlAPI';

export type Room = {
	name: string;
	ac_device_name: string;
	hue_room_id: string;
	hue_light_group: string;
};

export const fetchRooms = (): Promise<Room[]> => {
	return axios
		.get(`${API_BASE_URL}/home/rooms?bridge_name=Home`, {
			headers: API_HEADER,
		})
		.then((response) => {
			return response.data;
		});
};

export const useFetchRoomsState = (): UseQueryResult<Room[]> => {
	return useQuery<Room[], AxiosError>(['useFetchRoomsState'], () => {
		return fetchRooms();
	});
};

export const fetchOutdoorTemp = (): Promise<string> => {
	return axios
		.get(`${API_BASE_URL}/home/outdoor_temp`, {
			headers: API_HEADER,
		})
		.then((response) => {
			return response.data;
		});
};

export const useFetchOutdoorTemp = (): UseQueryResult<string> => {
	return useQuery<string, AxiosError>(['useFetchOutdoorTemp'], () => {
		return fetchOutdoorTemp();
	});
};
