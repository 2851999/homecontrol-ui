import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useHistoricTemperatures } from "../api/temperature";

interface RoomTemperatureGraphProps {
  roomName: string;
  startTimestamp?: Date;
  endTimestamp?: Date;
}

export const RoomTemperatureGraph = (props: RoomTemperatureGraphProps) => {
  const historicTemperaturesQuery = useHistoricTemperatures(
    props.roomName,
    props.startTimestamp,
    props.endTimestamp
  );

  return (
    <Card>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h5">{props.roomName}</Typography>
        {historicTemperaturesQuery.isLoading ||
        historicTemperaturesQuery.data === undefined ? (
          <CircularProgress />
        ) : (
          <LineChart
            dataset={
              // Does not like types at all here without explicitly stating them
              historicTemperaturesQuery.data as {
                timestamp: Date;
                value: number;
              }[]
            }
            xAxis={[{ dataKey: "timestamp", scaleType: "time" }]}
            series={[{ dataKey: "value", area: true, showMark: false }]}
            height={400}
          />
        )}
      </CardContent>
    </Card>
  );
};
