"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useDeleteRoom } from "../../api/rooms";
import { Room } from "../../api/schemas/rooms";
import { AdminControllerAccordion } from "./AdminControllerAccordion";
import { AdminRoomActionsAccordion } from "./AdminRoomActionsAccordion";
import { RoomDialog } from "./RoomDialog";

export interface AdminRoomCardProps {
  room: Room;
}

export const AdminRoomCard = (props: AdminRoomCardProps) => {
  // Room mutations
  const roomDeleteMutation = useDeleteRoom();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {props.room.name}
        </Typography>
        {props.room.controllers.map((controller, index) => (
          <AdminControllerAccordion key={index} controller={controller} />
        ))}
        <AdminRoomActionsAccordion room={props.room} />
        <Box sx={{ textAlign: "center" }}>
          <RoomDialog
            renderButton={(onClick) => (
              <IconButton onClick={onClick}>
                <EditIcon />
              </IconButton>
            )}
            existingData={props.room}
          />
          <IconButton
            color="error"
            onClick={() => {
              roomDeleteMutation.mutate(props.room.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
