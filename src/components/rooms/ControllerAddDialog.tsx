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
import { useEffect, useState } from "react";
import { ControlType, RoomController } from "../../api/schemas/rooms";
import { useACDevices } from "../../api/aircon";
import { useBroadlinkDevices } from "../../api/broadlink";
import { useHueBridges } from "../../api/hue";

interface ControllerSelectStepProps {
  controller: RoomController;
  onControllerUpdated: (newController: RoomController) => void;
}

const ControllerSelectStepAC = (props: ControllerSelectStepProps) => {
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
        value={props.controller.id}
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

const ControllerSelectStepBroadlink = (props: ControllerSelectStepProps) => {
  // Existing Broadlink devices
  const devicesQuery = useBroadlinkDevices();

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
      <InputLabel id="device-select-label">Broadlink Device</InputLabel>
      <Select
        labelId="type-select-label"
        id="type-select"
        label="Broadlink Device"
        value={props.controller.id}
        onChange={(event) =>
          props.onControllerUpdated({
            control_type: ControlType.BROADLINK,
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

const ControllerSelectStepHueRoom = (props: ControllerSelectStepProps) => {
  // Existing Hue bridges
  const bridgesQuery = useHueBridges();

  // Auto assign bridge if its the only one
  useEffect(() => {
    if (
      !bridgesQuery.isLoading &&
      bridgesQuery.data !== undefined &&
      bridgesQuery.data.length === 1 &&
      props.controller.id === ""
    ) {
      props.onControllerUpdated({
        ...props.controller,
        id: bridgesQuery.data[0].id,
      });
    }
  }, [bridgesQuery.data, bridgesQuery.isLoading, props]);

  return bridgesQuery.isLoading || bridgesQuery.data === undefined ? (
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
      <InputLabel id="device-select-label">Hue Bridge</InputLabel>
      <Select
        labelId="type-select-label"
        id="type-select"
        label="Hue Bridge"
        value={props.controller.id}
        onChange={(event) =>
          // Should already be guaranteed to be the correct type - only here
          // to get past type checking
          props.controller.control_type === ControlType.HUE_ROOM &&
          props.onControllerUpdated({
            ...props.controller,
            id: event.target.value as string,
          })
        }
      >
        {bridgesQuery.data.map((bridge) => (
          <MenuItem key={bridge.id} value={bridge.id}>
            {bridge.name}
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
      case ControlType.BROADLINK:
        return controller.id !== "";
      case ControlType.HUE_ROOM:
        return controller.id !== "" && controller.bridge_id !== "";
    }
  };

  const handleControllerUpdated = (newController: RoomController) => {
    setController(newController);
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
                controller={controller}
                onControllerUpdated={handleControllerUpdated}
              />
            );
          case ControlType.BROADLINK:
            return (
              <ControllerSelectStepBroadlink
                controller={controller}
                onControllerUpdated={handleControllerUpdated}
              />
            );
          case ControlType.HUE_ROOM:
            return (
              <ControllerSelectStepHueRoom
                controller={controller}
                onControllerUpdated={handleControllerUpdated}
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
