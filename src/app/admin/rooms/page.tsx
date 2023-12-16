"use client";

import { Grid } from "@mui/material";
import { useRooms } from "../../../api/rooms";
import { ControlType } from "../../../api/schemas/rooms";
import { LoadingPage } from "../../../components/LoadingPage";
import { AdminRoomCard } from "../../../components/rooms/AdminRoomCard";

export default function RoomsPage() {
  const roomsQuery = useRooms();

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <Grid container spacing={2} padding={1}>
      {roomsQuery.data.map((room) => (
        <Grid item key={room.id} xs={12} md={6} xl={3}>
          <AdminRoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  );
}
