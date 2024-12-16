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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useACDevices } from "../../api/aircon";
import {
  useBroadlinkActions,
  useBroadlinkActionsByIds,
  useBroadlinkDevices,
} from "../../api/broadlink";
import { useHueBridges, useHueRooms } from "../../api/hue";
import {
  ControlType,
  ControllerAC,
  ControllerBroadlink,
  ControllerHueRoom,
  RoomController,
} from "../../api/schemas/rooms";
import { CircularLoadingIndicator } from "../CircularLoadingIndicator";

interface ControllerSelectStepACProps {
  controller: ControllerAC;
  onControllerUpdated: (newController: RoomController) => void;
}

const ControllerSelectStepAC = (props: ControllerSelectStepACProps) => {
  // Existing AC devices
  const devicesQuery = useACDevices();

  return devicesQuery.isLoading || devicesQuery.data === undefined ? (
    <CircularLoadingIndicator />
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

interface ControllerSelectStepBroadlinkActionDialogProps {
  renderButton: (onClick: () => void) => React.ReactNode;
  onAddAction: (actionId: string) => void;
}

const ControllerSelectStepBroadlinkActionDialog = (
  props: ControllerSelectStepBroadlinkActionDialogProps
) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string | undefined>(undefined);

  // Available Broaadlink actions
  const actionsQuery = useBroadlinkActions();

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    props.onAddAction(action || "");
    handleClose();
  };

  return (
    <>
      {props.renderButton(() => setOpen(true))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Broadlink Action</DialogTitle>
        <DialogContent>
          {actionsQuery.isLoading || actionsQuery.data === undefined ? (
            <CircularLoadingIndicator />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="action-select-label">Broadlink Action</InputLabel>
              <Select
                labelId="action-select-label"
                id="action-select"
                label="Broadlink Action"
                value={action}
                onChange={(event) => setAction(event.target.value)}
              >
                {actionsQuery.data.map((action) => (
                  <MenuItem key={action.id} value={action.id}>
                    {action.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            disabled={
              // Disable until the relevant details are selected
              action === undefined
            }
            onClick={handleAdd}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface ControllerSelectStepBroadlinkProps {
  controller: ControllerBroadlink;
  onControllerUpdated: (newController: RoomController) => void;
}

const ControllerSelectStepBroadlink = (
  props: ControllerSelectStepBroadlinkProps
) => {
  // Existing Broadlink devices and actions
  const devicesQuery = useBroadlinkDevices();
  const actionsQueries = useBroadlinkActionsByIds(props.controller.actions);

  const handleDeleteClicked = (params: GridRowParams) => {
    props.onControllerUpdated({
      ...props.controller,
      actions: props.controller.actions.filter(
        (id: string) => id !== params.id
      ),
    });
  };

  const actionsTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            key="delete"
            onClick={() => handleDeleteClicked(params)}
          />,
        ];
      },
    },
  ];

  return devicesQuery.isLoading || devicesQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <>
      <FormControl fullWidth>
        <InputLabel id="device-select-label">Broadlink Device</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          label="Broadlink Device"
          value={props.controller.id}
          onChange={(event) =>
            props.onControllerUpdated({
              ...props.controller,
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
      <Typography variant="h5" sx={{ paddingY: 2 }}>
        Actions
      </Typography>
      {actionsQueries.some(
        (actionQuery) => actionQuery.isLoading || actionQuery.data === undefined
      ) ? (
        <CircularLoadingIndicator />
      ) : (
        <>
          <ControllerSelectStepBroadlinkActionDialog
            renderButton={(onClick) => (
              <Button startIcon={<AddIcon />} onClick={onClick}>
                Add action
              </Button>
            )}
            onAddAction={(actionId) =>
              props.onControllerUpdated({
                ...props.controller,
                actions: [...props.controller.actions, actionId],
              })
            }
          />
          <DataGrid
            rows={actionsQueries.map((actionQuery) => actionQuery.data)}
            columns={actionsTableColumns}
            autoHeight
          />
        </>
      )}
    </>
  );
};

interface ControllerSelectStepHueRoomProps {
  controller: ControllerHueRoom;
  onControllerUpdated: (newController: RoomController) => void;
}

const ControllerSelectStepHueRoom = (
  props: ControllerSelectStepHueRoomProps
) => {
  // Hue bridges and rooms
  const bridgesQuery = useHueBridges();
  const roomsQuery = useHueRooms(
    props.controller.bridge_id,
    props.controller.bridge_id !== ""
  );

  // Auto assign bridge if its the only one
  useEffect(() => {
    if (
      !bridgesQuery.isLoading &&
      bridgesQuery.data !== undefined &&
      bridgesQuery.data.length === 1 &&
      props.controller.bridge_id === ""
    ) {
      props.onControllerUpdated({
        ...props.controller,
        bridge_id: bridgesQuery.data[0].id,
      });
    }
  }, [bridgesQuery.data, bridgesQuery.isLoading, props]);

  return bridgesQuery.isLoading || bridgesQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <>
      <FormControl fullWidth>
        <InputLabel id="device-select-label">Hue Bridge</InputLabel>
        <Select
          labelId="device-select-label"
          id="device-select"
          label="Hue Bridge"
          value={props.controller.bridge_id}
          onChange={(event) =>
            props.onControllerUpdated({
              ...props.controller,
              bridge_id: event.target.value as string,
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
      {!roomsQuery.isLoading && roomsQuery.data !== undefined && (
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="room-select-label">Hue Room</InputLabel>
          <Select
            labelId="room-select-label"
            id="room-select"
            label="Hue Room"
            value={props.controller.id}
            onChange={(event) =>
              props.onControllerUpdated({
                ...props.controller,
                id: event.target.value as string,
              })
            }
          >
            {roomsQuery.data.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

interface ControllerDialogProps {
  renderButton: (onClick: () => void) => React.ReactNode;
  // Only present if adding
  addController?: (controller: RoomController) => void;
  // Only present if editing
  existingData?: RoomController;
  editController?: (controller: RoomController) => void;
}

const ADD_DIALOGUE_STEPS = ["Type", "Select"];

export const ControllerDialog = (props: ControllerDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [controller, setController] = useState<RoomController | undefined>(
    undefined
  );

  // Assign controller when updated (when editing)
  useEffect(() => {
    if (props.existingData !== undefined) setController(props.existingData);
  }, [props.existingData]);

  const handleControlTypeChange = (event: SelectChangeEvent<ControlType>) => {
    const newControlType = event.target.value;

    switch (newControlType) {
      case ControlType.AC:
        setController({ control_type: newControlType, id: "" });
        break;
      case ControlType.BROADLINK:
        setController({ control_type: newControlType, id: "", actions: [] });
        break;
      case ControlType.HUE_ROOM:
        setController({ control_type: newControlType, id: "", bridge_id: "" });
        break;
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
    setController(props.existingData ? props.existingData : undefined);
  };

  const handleFinish = async () => {
    if (controller !== undefined) {
      if (props.addController !== undefined) props.addController(controller);
      else if (props.editController !== undefined)
        props.editController(controller);
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
