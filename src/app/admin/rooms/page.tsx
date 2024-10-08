"use client";

import AddIcon from "@mui/icons-material/Add";
import { Fab, Grid2 } from "@mui/material";
import { useRooms } from "../../../api/rooms";
import { LoadingPage } from "../../../components/LoadingPage";
import { AdminRoomCard } from "../../../components/rooms/AdminRoomCard";
import { RoomDialog } from "../../../components/rooms/RoomDialog";

export default function RoomsPage() {
  const roomsQuery = useRooms();

  return roomsQuery.isLoading || roomsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <>
      <Grid2 container spacing={2} padding={1}>
        {roomsQuery.data.map((room) => (
          <Grid2 key={room.id} size={{ xs: 12, md: 6, xl: 3 }}>
            <AdminRoomCard room={room} />
          </Grid2>
        ))}
      </Grid2>
      <RoomDialog
        renderButton={(onClick) => (
          <Fab
            color="primary"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            onClick={onClick}
          >
            <AddIcon />
          </Fab>
        )}
      />
    </>
  );
}
