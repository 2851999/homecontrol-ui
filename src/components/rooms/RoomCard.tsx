"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { Room } from "../../api/schemas/rooms";
import { useRoomTemperature } from "../../api/temperature";
import { ControllerAccordion } from "./ControllerAccordion";

export interface RoomCardProps {
  room: Room;
}

export const RoomCard = (props: RoomCardProps) => {
  // Room temperature
  const roomTemperatureQuery = useRoomTemperature(props.room.id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {props.room.name}
        </Typography>
        {roomTemperatureQuery.data !== undefined &&
          roomTemperatureQuery.data.value !== null && (
            <Typography textAlign={"center"}>
              {roomTemperatureQuery.data?.value}&deg;C
            </Typography>
          )}

        {props.room.controllers.map((controller, index) => (
          <ControllerAccordion key={index} controller={controller} />
        ))}
      </CardContent>
    </Card>
  );
};
