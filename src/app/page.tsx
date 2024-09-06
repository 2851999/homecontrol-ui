"use client";

import { Grid2, Typography } from "@mui/material";
import { useRooms } from "../api/rooms";
import { withAuth } from "../components/Authenticated";
import { LoadingPage } from "../components/LoadingPage";
import { RoomCard } from "../components/rooms/RoomCard";
import { useOutdoorTemperature } from "../api/temperature";

function HomePage() {
  const roomsQuery = useRooms();
  const outdoorTemperatureQuery = useOutdoorTemperature();

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <Grid2 container spacing={2} padding={2}>
      {outdoorTemperatureQuery.data !== undefined &&
        outdoorTemperatureQuery.data.value !== null && (
          <Grid2 size={{ xs: 12 }} textAlign="center">
            <Typography variant="h5">
              Outdoor Temperature: {outdoorTemperatureQuery.data.value}&deg;C
            </Typography>
          </Grid2>
        )}
      {roomsQuery.data.map((room) => (
        <Grid2 key={room.id} size={{ xs: 12, md: 6, xl: 3 }}>
          <RoomCard room={room} />
        </Grid2>
      ))}
    </Grid2>
  );
}

export default withAuth(HomePage);
