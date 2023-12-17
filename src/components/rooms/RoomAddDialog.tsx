"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { useState } from "react";
import { RoomController, RoomPost } from "../../api/schemas/rooms";
import { AdminController } from "./AdminController";
import { ControllerAddDialog } from "./ControllerAddDialog";
import { useAddRoom } from "../../api/rooms";

interface RoomAddDialogProps {
  renderButton: (onClick: () => void) => void;
}

const ADD_DIALOGUE_STEPS = ["Name", "Controllers"];

export const RoomAddDialog = (props: RoomAddDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [room, setRoom] = useState<RoomPost>({ name: "", controllers: [] });
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  // Mutations
  const roomAddMutation = useAddRoom();

  const handleNameChange = (newName: string) => {
    if (nameError !== undefined) setNameError(undefined);

    setRoom({ ...room, name: newName });
  };

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            label="Name"
            value={room.name}
            required
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!nameError}
            helperText={nameError}
            fullWidth
          />
        );
      case 1:
        return (
          <>
            {room.controllers.map((controller, index) => (
              <Box key={index} sx={{ display: "flex" }}>
                <Box sx={{ width: "100%" }}>
                  <AdminController controller={controller} />
                </Box>
                <IconButton
                  color="error"
                  onClick={() => {
                    setRoom({
                      ...room,
                      controllers: room.controllers.filter(
                        (value) => value !== controller
                      ),
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}{" "}
            <ControllerAddDialog
              renderButton={(onClick) => (
                <Button startIcon={<AddIcon />} onClick={onClick}>
                  Add Controller
                </Button>
              )}
              addController={(controller: RoomController) =>
                setRoom({
                  ...room,
                  controllers: [...room.controllers, controller],
                })
              }
            />
          </>
        );
    }
  };

  // Returns true when valid
  const validateForm = (): boolean => {
    switch (activeStep) {
      case 0:
        if (room.name.trim() === "") {
          setNameError("You must enter a name");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = async () => {
    if (validateForm()) setActiveStep(activeStep + 1);
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setRoom({ name: "", controllers: [] });
    setNameError(undefined);
  };

  const handleFinish = async () => {
    // Shouldn't be called at all until there are no errors (as finish button
    // will be disabled)
    roomAddMutation.mutateAsync(room).then(() => handleClose());
  };

  return (
    <>
      {props.renderButton(() => setOpen(true))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Room</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
            {ADD_DIALOGUE_STEPS.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === ADD_DIALOGUE_STEPS.length - 1 ? (
            <Button onClick={handleFinish}>Finish</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
