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
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useACDeviceState, useACDevices } from "../../api/aircon";
import {
  useBroadlinkActionsByIds,
  useBroadlinkDevices,
} from "../../api/broadlink";
import { useHueRoomState } from "../../api/hue";
import {
  TaskACStatePost,
  TaskBroadlinkAction,
  TaskHueScene,
  TaskPost,
  TaskType,
} from "../../api/schemas/actions";
import {
  ACDeviceFanSpeed,
  ACDeviceMode,
  ACDeviceStatePut,
  ACDeviceSwingMode,
} from "../../api/schemas/aircon";
import {
  ControlType,
  ControllerHueRoom,
  Room,
  RoomController,
} from "../../api/schemas/rooms";
import { CircularLoadingIndicator } from "../CircularLoadingIndicator";
import { ACController } from "../devices/ACController";

const DEFAULT_AC_PUT: ACDeviceStatePut = {
  power: false,
  target_temperature: 17,
  operational_mode: ACDeviceMode.AUTO,
  fan_speed: ACDeviceFanSpeed.AUTO,
  swing_mode: ACDeviceSwingMode.OFF,
  eco_mode: false,
  turbo_mode: false,
  fahrenheit: false,
  prompt_tone: false,
};

interface TaskSelectStepACProps {
  room: Room;
  task: TaskACStatePost;
  onTaskUpdated: (newTask: TaskPost) => void;
}

const TaskSelectStepAC = (props: TaskSelectStepACProps) => {
  // Existing AC devices (will only display those that are relevant)
  const devicesQuery = useACDevices();

  // Locate the ids of ac devices in the room
  const validDeviceIds = props.room.controllers.reduce(
    (filtered: string[], controller: RoomController) => {
      if (controller.control_type === ControlType.AC)
        filtered.push(controller.id);
      return filtered;
    },
    []
  );

  // Current device state
  const deviceStateQuery = useACDeviceState(props.task.device_id);

  // After loading the current state of the device use it as the starting point for the state selection
  useEffect(() => {
    if (!deviceStateQuery.isLoading && deviceStateQuery.data !== undefined) {
      props.onTaskUpdated({
        ...props.task,
        state: {
          ...deviceStateQuery.data,
          prompt_tone: DEFAULT_AC_PUT.prompt_tone,
        },
      });
    }
    // Avoid recursion of props changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceStateQuery.data, deviceStateQuery.isLoading]);

  return devicesQuery.isLoading || devicesQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <FormControl fullWidth>
      <InputLabel id="device-select-label">AC Device</InputLabel>
      <Select
        labelId="type-select-label"
        id="type-select"
        label="AC Device"
        value={props.task.device_id}
        onChange={(event) =>
          props.onTaskUpdated({
            task_type: TaskType.AC_STATE,
            device_id: event.target.value as string,
            state: DEFAULT_AC_PUT,
          })
        }
      >
        {devicesQuery.data
          .filter((device) => validDeviceIds.includes(device.id))
          .map((device) => (
            <MenuItem key={device.id} value={device.id}>
              {device.name}
            </MenuItem>
          ))}
      </Select>
      {props.task.device_id !== "" ? (
        deviceStateQuery.isLoading || deviceStateQuery.data === undefined ? (
          <LinearProgress />
        ) : (
          <Box marginTop={2}>
            <ACController
              deviceState={{ ...deviceStateQuery.data, ...props.task.state }}
              onChangeDeviceState={(deviceState) =>
                props.onTaskUpdated({ ...props.task, state: deviceState })
              }
              useInternalState={true}
            />
          </Box>
        )
      ) : null}
    </FormControl>
  );
};

interface TaskSelectStepBroadlinkActionProps {
  room: Room;
  task: TaskBroadlinkAction;
  onTaskUpdated: (newTask: TaskPost) => void;
}

const TaskSelectStepBroadlinkAction = (
  props: TaskSelectStepBroadlinkActionProps
) => {
  // Existing Broadlink devices (will only display those that are relevant)
  const devicesQuery = useBroadlinkDevices();

  // Locate the ids of Broadlink devices and actions in the room
  const validDeviceIds = props.room.controllers.reduce(
    (filtered: string[], controller: RoomController) => {
      if (controller.control_type === ControlType.BROADLINK)
        filtered.push(controller.id);
      return filtered;
    },
    []
  );
  const validActionIds = props.room.controllers.reduce(
    (filtered: string[], controller: RoomController) => {
      if (
        controller.control_type === ControlType.BROADLINK &&
        controller.id === props.task.device_id
      ) {
        controller.actions.forEach((action_id) => {
          filtered.push(action_id);
        });
      }
      return filtered;
    },
    []
  );
  const validActionsQueries = useBroadlinkActionsByIds(validActionIds);

  return devicesQuery.isLoading ||
    devicesQuery.data === undefined ||
    validActionsQueries.some(
      (validActionQuery) =>
        validActionQuery.isLoading || validActionQuery.data === undefined
    ) ? (
    <CircularLoadingIndicator />
  ) : (
    <>
      <FormControl fullWidth>
        <InputLabel id="device-select-label">Broadlink Device</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          label="Broadlink Device"
          value={props.task.device_id}
          onChange={(event) =>
            props.onTaskUpdated({
              task_type: TaskType.BROADLINK_ACTION,
              device_id: event.target.value as string,
              action_id: "",
            })
          }
        >
          {devicesQuery.data
            .filter((device) => validDeviceIds.includes(device.id))
            .map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="action-select-label">Broadlink Action</InputLabel>
        <Select
          labelId="action-select-label"
          id="action-select"
          label="Broadlink Action"
          value={props.task.action_id}
          onChange={(event) =>
            props.onTaskUpdated({
              task_type: TaskType.BROADLINK_ACTION,
              device_id: props.task.device_id,
              action_id: event.target.value as string,
            })
          }
        >
          {validActionsQueries.map((validActionQuery) => (
            <MenuItem
              key={validActionQuery.data?.id}
              value={validActionQuery.data?.id}
            >
              {validActionQuery.data?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

interface TaskSelectStepHueSceneProps {
  room: Room;
  task: TaskHueScene;
  onTaskUpdated: (newTask: TaskPost) => void;
}

const TaskSelectStepHueScene = (props: TaskSelectStepHueSceneProps) => {
  // Obtain an existing Hue room controller
  const hueRoomControllers = props.room.controllers.reduce(
    (filtered: ControllerHueRoom[], controller: RoomController) => {
      if (controller.control_type === ControlType.HUE_ROOM)
        filtered.push(controller);
      return filtered;
    },
    []
  );
  const hueRoomController =
    hueRoomControllers.length > 0 ? hueRoomControllers[0] : undefined;

  // Existing hue room
  const hueRoomStateQuery = useHueRoomState(
    hueRoomController?.bridge_id || "",
    hueRoomController?.id || ""
  );

  return hueRoomStateQuery.isLoading || hueRoomStateQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="scene-select-label">Hue Scene</InputLabel>
        <Select
          labelId="scene-select-label"
          id="scene-select"
          label="Hue Scene"
          value={props.task.scene_id}
          onChange={(event) =>
            props.onTaskUpdated({
              task_type: TaskType.HUE_SCENE,
              bridge_id: hueRoomController?.bridge_id || "",
              scene_id: event.target.value as string,
            })
          }
        >
          {Object.keys(hueRoomStateQuery.data.scenes).map((sceneId) => (
            <MenuItem key={sceneId} value={sceneId}>
              {hueRoomStateQuery.data.scenes[sceneId].name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

interface TaskDialogProps {
  room: Room;
  renderButton: (onClick: () => void) => void;
  addTask: (task: TaskPost) => void;
}

const ADD_DIALOGUE_STEPS = ["Type", "Select"];

export const TaskDialog = (props: TaskDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [task, setTask] = useState<TaskPost | undefined>(undefined);

  const handleTaskTypeChange = (event: SelectChangeEvent<TaskType>) => {
    const newTaskType = event.target.value;

    switch (newTaskType) {
      case TaskType.AC_STATE:
        setTask({
          task_type: newTaskType,
          device_id: "",
          state: DEFAULT_AC_PUT,
        });
        break;
      case TaskType.BROADLINK_ACTION:
        setTask({ task_type: newTaskType, device_id: "", action_id: "" });
        break;
      case TaskType.HUE_SCENE:
        setTask({ task_type: newTaskType, bridge_id: "", scene_id: "" });
        break;
    }
  };

  const validateSelectStepComplete = (task: TaskPost) => {
    switch (task.task_type) {
      case TaskType.AC_STATE:
        return task.device_id !== "";
      case TaskType.BROADLINK_ACTION:
        return task.device_id !== "" && task.action_id !== "";
      case TaskType.HUE_SCENE:
        return task.bridge_id !== "" && task.scene_id !== "";
    }
  };

  const handleTaskUpdated = (newTask: TaskPost) => {
    setTask(newTask);
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
              value={task?.task_type}
              onChange={handleTaskTypeChange}
            >
              {Object.keys(TaskType).map((taskTypeKey) => (
                <MenuItem
                  key={taskTypeKey}
                  value={TaskType[taskTypeKey as keyof typeof TaskType]}
                >
                  {taskTypeKey}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        switch (task?.task_type) {
          case TaskType.AC_STATE:
            return (
              <TaskSelectStepAC
                room={props.room}
                task={task}
                onTaskUpdated={handleTaskUpdated}
              />
            );
          case TaskType.BROADLINK_ACTION:
            return (
              <TaskSelectStepBroadlinkAction
                room={props.room}
                task={task}
                onTaskUpdated={handleTaskUpdated}
              />
            );
          case TaskType.HUE_SCENE:
            return (
              <TaskSelectStepHueScene
                room={props.room}
                task={task}
                onTaskUpdated={handleTaskUpdated}
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
    setTask(undefined);
  };

  const handleFinish = async () => {
    if (task !== undefined) {
      props.addTask(task);
      handleClose();
    }
  };

  return (
    <>
      {props.renderButton(() => setOpen(true))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Task</DialogTitle>
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
                task === undefined || !validateSelectStepComplete(task)
              }
              onClick={handleFinish}
            >
              Finish
            </Button>
          ) : (
            <Button
              disabled={
                // Disable until the task type is selected
                task === undefined
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
