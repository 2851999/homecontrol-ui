export interface Temperature {
  value: number | null;
}

export interface HistoricTemperature {
  id: string;
  timestamp: Date;
  value: number;
  room_name: string;
}
