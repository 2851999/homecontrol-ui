"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { Room } from "../../api/schemas/rooms";
import { Controller } from "./Controller";

export interface RoomCardProps {
  room: Room;
}

export const RoomCard = (props: RoomCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {props.room.name}
        </Typography>
        {props.room.controllers.map((controller, index) => (
          <Controller key={index} controller={controller} />
        ))}
      </CardContent>
    </Card>
  );
};
