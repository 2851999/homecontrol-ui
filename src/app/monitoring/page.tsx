"use client";

import { Grid2 } from "@mui/material";
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
    <Grid2 container spacing={2} padding={2}>
      <Grid2
        container
        size={{
          xs: 12,
        }}
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        <Grid2>
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
        </Grid2>
        <Grid2>
          <MobileDateTimePicker
            label="End Timestamp"
            value={endTimestamp !== undefined ? dayjs(endTimestamp) : undefined}
            onChange={(newValue) => setEndTimestamp(newValue?.toDate())}
            slotProps={{
              actionBar: { actions: ["cancel", "clear", "today", "accept"] },
            }}
          />
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <RoomTemperatureGraph
          roomName={"outdoor"}
          startTimestamp={startTimestamp}
          endTimestamp={endTimestamp}
        />
      </Grid2>
      {roomsQuery.data
        .filter((room) => hasACController(room))
        .map((room) => (
          <Grid2 key={room.id} size={{ xs: 12, md: 6, xl: 3 }}>
            <RoomTemperatureGraph
              roomName={room.name}
              startTimestamp={startTimestamp}
              endTimestamp={endTimestamp}
            />
          </Grid2>
        ))}
    </Grid2>
  );
}

export default withAuth(MonitoringPage);
