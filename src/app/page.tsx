"use client";

import { Grid, Typography } from "@mui/material";
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
    <Grid container spacing={2} padding={2}>
      {outdoorTemperatureQuery.data !== undefined &&
        outdoorTemperatureQuery.data.value !== null && (
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5">
              Outdoor Temperature: {outdoorTemperatureQuery.data.value}&deg;C
            </Typography>
          </Grid>
        )}
      {roomsQuery.data.map((room) => (
        <Grid item key={room.id} xs={12} md={6} xl={3}>
          <RoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  );
}

export default withAuth(HomePage);
