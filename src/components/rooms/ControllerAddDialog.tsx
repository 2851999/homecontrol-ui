"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import { ControlType, RoomController } from "../../api/schemas/rooms";

interface ControllerAddDialogProps {
  renderButton: (onClick: () => void) => void;
}

const ADD_DIALOGUE_STEPS = ["Type", "Select"];

export const ControllerAddDialog = (props: ControllerAddDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [controller, setController] = useState<RoomController>({
    control_type: ControlType.AC,
    id: "",
  });

  const handleControlTypeChange = (event: SelectChangeEvent<ControlType>) => {
    const newControlType = event.target.value;

    switch (newControlType) {
      case ControlType.AC:
        setController({ control_type: newControlType, id: "" });
      case ControlType.BROADLINK:
        setController({ control_type: newControlType, id: "" });
      case ControlType.HUE_ROOM:
        setController({ control_type: newControlType, id: "", bridge_id: "" });
    }
  };

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <FormControl fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              label="Type"
              value={controller.control_type}
              onChange={handleControlTypeChange}
            >
              {Object.keys(ControlType).map((controlTypeKey) => (
                <MenuItem
                  key={controlTypeKey}
                  value={
                    ControlType[controlTypeKey as keyof typeof ControlType]
                  }
                >
                  {controlTypeKey}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        return null;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = async () => {
    setActiveStep(activeStep + 1);
  };

  const handleFinish = async () => {};

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  return (
    <>
      {props.renderButton(() => setOpen(true))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Controller</DialogTitle>
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
