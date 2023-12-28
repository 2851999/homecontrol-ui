"use client";

import { Grid } from "@mui/material";
import { useRooms } from "../../api/rooms";
import { ControlType, Room } from "../../api/schemas/rooms";
import { LoadingPage } from "../../components/LoadingPage";
import { withAuth } from "../../components/Authenticated";
import { RoomTemperatureGraph } from "../../components/RoomTemperatureGraph";

/* Returns whether a room has an AC controller - only ones with one can display
   temperatures */
function hasACController(room: Room): boolean {
  return room.controllers.some(
    (controller) => controller.control_type === ControlType.AC
  );
}

function MonitoringPage() {
  const roomsQuery = useRooms();

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12} md={6}>
        <RoomTemperatureGraph roomName={"outdoor"} />
      </Grid>
      {roomsQuery.data
        .filter((room) => hasACController(room))
        .map((room) => (
          <Grid item key={room.id} xs={12} md={6} xl={3}>
            <RoomTemperatureGraph roomName={room.name} />
          </Grid>
        ))}
    </Grid>
  );
}

export default withAuth(MonitoringPage);
