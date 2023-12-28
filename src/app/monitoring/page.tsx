"use client";

import { Grid } from "@mui/material";
import { useRooms } from "../../api/rooms";
import { ControlType, Room } from "../../api/schemas/rooms";
import { LoadingPage } from "../../components/LoadingPage";
import { withAuth } from "../../components/Authenticated";
import { RoomTemperatureGraph } from "../../components/RoomTemperatureGraph";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";

/* Returns whether a room has an AC controller - only ones with one can display
   temperatures */
function hasACController(room: Room): boolean {
  return room.controllers.some(
    (controller) => controller.control_type === ControlType.AC
  );
}

/* Returns a default start timestamp in the past */
function getDefaultStartTimestamp(): Date {
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - 30);
  return timestamp;
}

function MonitoringPage() {
  const roomsQuery = useRooms();

  // Start and end timestamps
  const [startTimestamp, setStartTimestamp] = useState<Date | undefined>(
    getDefaultStartTimestamp()
  );
  const [endTimestamp, setEndTimestamp] = useState<Date | undefined>(
    new Date()
  );

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <Grid container spacing={2} padding={2}>
      <Grid
        item
        container
        xs={12}
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        <Grid item>
          <MobileDateTimePicker
            label="Start Timestamp"
            value={
              startTimestamp !== undefined ? dayjs(startTimestamp) : undefined
            }
            onChange={(newValue) => setStartTimestamp(newValue?.toDate())}
            slotProps={{
              actionBar: { actions: ["cancel", "clear", "today", "accept"] },
            }}
          />
        </Grid>
        <Grid item>
          <MobileDateTimePicker
            label="End Timestamp"
            value={endTimestamp !== undefined ? dayjs(endTimestamp) : undefined}
            onChange={(newValue) => setEndTimestamp(newValue?.toDate())}
            slotProps={{
              actionBar: { actions: ["cancel", "clear", "today", "accept"] },
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <RoomTemperatureGraph
          roomName={"outdoor"}
          startTimestamp={startTimestamp}
          endTimestamp={endTimestamp}
        />
      </Grid>
      {roomsQuery.data
        .filter((room) => hasACController(room))
        .map((room) => (
          <Grid item key={room.id} xs={12} md={6} xl={3}>
            <RoomTemperatureGraph
              roomName={room.name}
              startTimestamp={startTimestamp}
              endTimestamp={endTimestamp}
            />
          </Grid>
        ))}
    </Grid>
  );
}

export default withAuth(MonitoringPage);
