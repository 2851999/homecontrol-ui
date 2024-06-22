"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAddRoomAction, usePatchRoomAction } from "../../api/actions";
import {
  RoomAction,
  RoomActionPost,
  TaskPost,
} from "../../api/schemas/actions";
import { Room } from "../../api/schemas/rooms";
import { ICONS } from "./Actions";
import { TaskDialog } from "./TaskDialog";
import EditIcon from "@mui/icons-material/Edit";

interface RoomActionDialogProps {
  renderButton: (onClick: () => void) => void;
  room: Room;
  // Only present if editing
  existingData?: RoomAction;
}

const ADD_DIALOGUE_STEPS = ["Name", "Tasks", "Icon"];

export const RoomActionDialog = (props: RoomActionDialogProps) => {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [action, setAction] = useState<RoomActionPost>({
    name: "",
    room_id: props.room.id,
    icon: Object.keys(ICONS)[0],
    tasks: [],
  });
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Assign room action when updated (when editing)
  useEffect(() => {
    if (open && props.existingData !== undefined)
      setAction(props.existingData as RoomActionPost);
  }, [open, props.existingData]);

  // Mutations
  const roomActionAddMutation = useAddRoomAction();
  const roomActionPatchMutation = usePatchRoomAction();

  const handleNameChange = (newName: string) => {
    if (nameError !== undefined) setNameError(undefined);

    setAction({ ...action, name: newName });
  };

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            label="Action Name"
            value={action.name}
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
            {action.tasks.map((task, taskIndex) => (
              <Card
                key={`${task.task_type}-${taskIndex}`}
                sx={{
                  display: "flex",
                  paddingX: 1,
                  paddingY: 0.5,
                  alignItems: "center",
                  marginY: 0.5,
                }}
              >
                <Typography>{task.task_type}</Typography>
                <TaskDialog
                  room={props.room}
                  renderButton={(onClick) => (
                    <IconButton sx={{ marginLeft: "auto" }} onClick={onClick}>
                      <EditIcon />
                    </IconButton>
                  )}
                  addTask={(task: TaskPost) =>
                    setAction({
                      ...action,
                      tasks: [...action.tasks, task],
                    })
                  }
                  editTask={(newTask: TaskPost) =>
                    setAction({
                      ...action,
                      tasks: [
                        ...action.tasks.map((currentTask, currentTaskIndex) =>
                          currentTaskIndex === taskIndex ? newTask : task
                        ),
                      ],
                    })
                  }
                  existingData={task}
                />
                <IconButton
                  onClick={() => {
                    setAction({
                      ...action,
                      tasks: action.tasks.filter((value) => value !== task),
                    });
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Card>
            ))}
            <TaskDialog
              room={props.room}
              renderButton={(onClick) => (
                <Button startIcon={<AddIcon />} onClick={onClick}>
                  Add Task
                </Button>
              )}
              addTask={(task: TaskPost) =>
                setAction({
                  ...action,
                  tasks: [...action.tasks, task],
                })
              }
            />
          </>
        );
      case 2:
        return (
          <FormControl fullWidth>
            <InputLabel id="icon-select-label">Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              id="icon-select"
              label="Icon"
              value={action.icon}
              onChange={(event) =>
                setAction({ ...action, icon: event.target.value as string })
              }
              renderValue={(value) => (
                <Box sx={{ display: "flex" }}>
                  {ICONS[value]}
                  <Typography sx={{ marginLeft: 0.5 }}>{value}</Typography>
                </Box>
              )}
            >
              {Object.keys(ICONS).map((icon) => (
                <MenuItem key={icon} value={icon}>
                  {ICONS[icon]}
                  <Typography sx={{ marginLeft: 0.5 }}>{icon}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
    }
  };

  // Returns true when valid
  const validateForm = (): boolean => {
    switch (activeStep) {
      case 0:
        if (action.name.trim() === "") {
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
    setAction({
      name: "",
      room_id: props.room.id,
      icon: Object.keys(ICONS)[0],
      tasks: [],
    });
    setNameError(undefined);
  };

  const handleFinish = () => {
    if (props.existingData === undefined)
      // Adding
      roomActionAddMutation.mutateAsync(action).then(() => handleClose());
    //Editing
    else {
      const nameUpdated = action.name !== props.existingData.name;
      const roomIdUpdated = action.room_id !== props.existingData.room_id;
      const iconUpdated = action.icon !== props.existingData.icon;
      const tasksUpdated = action.tasks !== props.existingData.tasks;

      if (nameUpdated || roomIdUpdated || iconUpdated || tasksUpdated)
        roomActionPatchMutation
          .mutateAsync({
            action_id: props.existingData.id,
            actionData: {
              name: nameUpdated ? action.name : undefined,
              room_id: roomIdUpdated ? action.room_id : undefined,
              icon: iconUpdated ? action.icon : undefined,
              tasks: tasksUpdated ? action.tasks : undefined,
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
        <DialogTitle>
          {props.existingData ? "Edit Room Action" : "Add Room Action"}
        </DialogTitle>
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
