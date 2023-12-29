"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAddRoom, usePatchRoom } from "../../api/rooms";
import { Room, RoomController, RoomPost } from "../../api/schemas/rooms";
import { AdminControllerAccordion } from "./AdminControllerAccordion";
import { ControllerDialog } from "./ControllerDialog";

interface RoomActionDialogProps {
  renderButton: (onClick: () => void) => void;
}

export const RoomActionDialog = (props: RoomActionDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {props.renderButton(() => setOpen(true))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Room Action</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};
