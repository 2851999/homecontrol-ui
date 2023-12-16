import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useDeleteRoom } from "../../api/rooms";
import { ControlType, Room } from "../../api/schemas/rooms";
import { AdminControllerAC } from "./AdminControllerAC";
import { AdminControllerBroadlink } from "./AdminControllerBroadlink";
import { AdminControllerHueRoom } from "./AdminControllerHueRoom";

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
        {props.room.controllers.map((controller) => {
          switch (controller.control_type) {
            case ControlType.AC:
              return (
                <AdminControllerAC
                  key={`${controller.control_type}-${controller.id}`}
                  controller={controller}
                />
              );
            case ControlType.BROADLINK:
              return (
                <AdminControllerBroadlink
                  key={`${controller.control_type}-${controller.id}`}
                  controller={controller}
                />
              );
            case ControlType.HUE_ROOM:
              return (
                <AdminControllerHueRoom
                  key={`${controller.control_type}-${controller.id}-${controller.bridge_id}`}
                  controller={controller}
                />
              );
          }
        })}
        <Box sx={{ textAlign: "center" }}>
          <IconButton>
            <EditIcon />
          </IconButton>
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
