"use client";

import { Grid } from "@mui/material";
import { useRooms } from "../api/rooms";
import { withAuth } from "../components/Authenticated";
import { LoadingPage } from "../components/LoadingPage";
import { RoomCard } from "../components/rooms/RoomCard";

function HomePage() {
  const roomsQuery = useRooms();

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <Grid container spacing={2} padding={1}>
      {roomsQuery.data.map((room) => (
        <Grid item key={room.id} xs={12} md={6} xl={3}>
          <RoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  );
}

export default withAuth(HomePage);
