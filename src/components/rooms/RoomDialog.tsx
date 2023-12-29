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

interface RoomDialogProps {
  renderButton: (onClick: () => void) => void;
  // Only present if editing
  existingData?: Room;
}

const ADD_DIALOGUE_STEPS = ["Name", "Controllers"];

export const RoomDialog = (props: RoomDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [room, setRoom] = useState<RoomPost>({ name: "", controllers: [] });
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  // Assign room when updated (when editing)
  useEffect(() => {
    if (props.existingData !== undefined)
      setRoom(props.existingData as RoomPost);
  }, [props.existingData]);

  // Mutations
  const roomAddMutation = useAddRoom();
  const roomPatchMutation = usePatchRoom();

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
                  <AdminControllerAccordion controller={controller} />
                </Box>
                <ControllerDialog
                  renderButton={(onClick) => (
                    <IconButton onClick={onClick}>
                      <EditIcon />
                    </IconButton>
                  )}
                  existingData={controller}
                  editController={(controller: RoomController) =>
                    setRoom({
                      ...room,
                      controllers: room.controllers.map(
                        (oldController, oldControllerIndex) => {
                          if (oldControllerIndex === index) return controller;
                          else return oldController;
                        }
                      ),
                    })
                  }
                />
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
            ))}
            <ControllerDialog
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
    setRoom(
      props.existingData
        ? (props.existingData as RoomPost)
        : { name: "", controllers: [] }
    );
    setNameError(undefined);
  };

  const handleFinish = async () => {
    // Shouldn't be called at all until there are no errors (as finish button
    // will be disabled)
    if (props.existingData === undefined)
      // Adding
      roomAddMutation.mutateAsync(room).then(() => handleClose());
    // Editing
    else {
      const nameUpdated =
        room.name !== props.existingData.name ? room.name : undefined;
      const controllersUpdated =
        room.controllers !== props.existingData.controllers
          ? room.controllers
          : undefined;

      if (nameUpdated || controllersUpdated)
        roomPatchMutation
          .mutateAsync({
            roomId: props.existingData.id,
            roomData: {
              name: nameUpdated ? room.name : undefined,
              controllers: controllersUpdated ? room.controllers : undefined,
            },
          })
          .then(() => handleClose());
      else handleClose();
    }
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
