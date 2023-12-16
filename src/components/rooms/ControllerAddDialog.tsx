"use client";

import {
  Box,
  Button,
  CircularProgress,
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
import { useACDevices } from "../../api/aircon";

interface ControllerSelectStepACProps {
  onControllerUpdated: (newController: RoomController) => void;
}

const ControllerSelectStepAC = (props: ControllerSelectStepACProps) => {
  // Existing AC devices
  const devicesQuery = useACDevices();

  return devicesQuery.isLoading || devicesQuery.data === undefined ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <FormControl fullWidth>
      <InputLabel id="device-select-label">AC Device</InputLabel>
      <Select
        labelId="type-select-label"
        id="type-select"
        label="AC Device"
        onChange={(event) =>
          props.onControllerUpdated({
            control_type: ControlType.AC,
            id: event.target.value as string,
          })
        }
      >
        {devicesQuery.data.map((device) => (
          <MenuItem key={device.id} value={device.id}>
            {device.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface ControllerAddDialogProps {
  renderButton: (onClick: () => void) => void;
  addController: (controller: RoomController) => void;
}

const ADD_DIALOGUE_STEPS = ["Type", "Select"];

export const ControllerAddDialog = (props: ControllerAddDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [controller, setController] = useState<RoomController | undefined>(
    undefined
  );

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

  const validateSelectStepComplete = (controller: RoomController) => {
    switch (controller.control_type) {
      case ControlType.AC:
        return controller.id !== "";
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
              value={controller?.control_type}
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
        switch (controller?.control_type) {
          case ControlType.AC:
            return (
              <ControllerSelectStepAC
                onControllerUpdated={(newController: RoomController) =>
                  setController(newController)
                }
              />
            );
        }
        return null;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = async () => {
    setActiveStep(activeStep + 1);
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const handleFinish = async () => {
    if (controller !== undefined) {
      props.addController(controller);
      handleClose();
    }
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
            <Button
              disabled={
                // Disable until the relevant details are selected
                controller === undefined ||
                !validateSelectStepComplete(controller)
              }
              onClick={handleFinish}
            >
              Finish
            </Button>
          ) : (
            <Button
              disabled={
                // Disable until the controller type is selected
                controller === undefined
              }
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
