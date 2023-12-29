"use client";

import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Room } from "../../api/schemas/rooms";
import { useRoomTemperature } from "../../api/temperature";
import { ControllerAccordion } from "./ControllerAccordion";
import { useExecuteRoomAction, useRoomActions } from "../../api/actions";
import { ICONS } from "./Actions";
import { RoomAction } from "../../api/schemas/actions";

const RoomCardAction = (props: { roomAction: RoomAction }) => {
  // Mutations
  const actionExecuteMutation = useExecuteRoomAction(props.roomAction);

  return (
    <Tooltip title={props.roomAction.name}>
      <IconButton onClick={() => actionExecuteMutation.mutate()}>
        {ICONS[props.roomAction.icon]}
      </IconButton>
    </Tooltip>
  );
};

export interface RoomCardProps {
  room: Room;
}

export const RoomCard = (props: RoomCardProps) => {
  // Room temperature
  const roomTemperatureQuery = useRoomTemperature(props.room.id);

  // Actions for this room
  const roomActionsQuery = useRoomActions(props.room.id);

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
        <Box sx={{ textAlign: "center" }}>
          {roomActionsQuery.data !== undefined &&
            roomActionsQuery.data.map((roomAction) => (
              <RoomCardAction roomAction={roomAction} key={roomAction.id} />
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};
