"use client";

import { useAddJob, usePatchJob } from "../api/scheduler";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRoomActions } from "../api/actions";
import { useRooms } from "../api/rooms";
import {
  Job,
  JobPost,
  TaskExecuteRoomAction,
  TaskType,
  TimeDelta,
  TriggerType,
} from "../api/schemas/scheduler";
import { CircularLoadingIndicator } from "./CircularLoadingIndicator";

interface TaskError {
  room: string | undefined;
  action: string | undefined;
}

interface ExecuteRoomActionTaskForm {
  task: TaskExecuteRoomAction;
  taskError: TaskError;
  setTaskError: (taskError: TaskError) => void;
  onTaskUpdated: (newTask: TaskExecuteRoomAction) => void;
}

const ExecuteRoomActionTaskForm = (props: ExecuteRoomActionTaskForm) => {
  const roomsQuery = useRooms();
  const roomActionsQuery = useRoomActions();

  return roomsQuery.isLoading ||
    roomsQuery.data === undefined ||
    roomActionsQuery.isLoading ||
    roomActionsQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <>
      <FormControl fullWidth required>
        <InputLabel id="room-select-label">Room</InputLabel>
        <Select
          labelId="room-select-label"
          id="room-select"
          label="Room"
          value={props.task.room_id}
          onChange={(event) => {
            props.onTaskUpdated({
              ...props.task,
              room_id: event.target.value,
              action_id: "",
            });
            props.setTaskError({ ...props.taskError, room: undefined });
          }}
          error={!!props.taskError.room}
        >
          {roomsQuery.data.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
        {!!props.taskError.room && (
          <FormHelperText error>{props.taskError.room}</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 2 }} required>
        <InputLabel id="action-select-label">Action</InputLabel>
        <Select
          labelId="action-select-label"
          id="action-select"
          label="Action"
          value={props.task.action_id}
          onChange={(event) => {
            props.onTaskUpdated({
              ...props.task,
              action_id: event.target.value,
            });
            props.setTaskError({ ...props.taskError, action: undefined });
          }}
          error={!!props.taskError.action}
        >
          {roomActionsQuery.data
            .filter((action) => action.room_id === props.task.room_id)
            .map((action) => (
              <MenuItem key={action.id} value={action.id}>
                {action.name}
              </MenuItem>
            ))}
        </Select>
        {!!props.taskError.action && (
          <FormHelperText error>{props.taskError.action}</FormHelperText>
        )}
      </FormControl>
    </>
  );
};

interface JobDialogProps {
  renderButton?: (onClick: () => void) => void;
  // Only present if editing
  existingData?: Job;
  // Only present if being controlled externally
  open?: boolean;
  onClose?: () => void;
}

export const JobDialogue = (props: JobDialogProps) => {
  // Mutations
  const jobAddMutation = useAddJob();
  const jobPatchMutation = usePatchJob();

  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  const [data, setData] = useState<JobPost>({
    name: "",
    task: { task_type: TaskType.RECORD_ALL_TEMPERATURES },
    trigger: { trigger_type: TriggerType.CRON, value: "" },
  });
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [taskError, setTaskError] = useState<TaskError>({
    room: undefined,
    action: undefined,
  });
  const [crontabError, setCrontabError] = useState<string | undefined>(
    undefined
  );

  const [otherError, setOtherError] = useState<boolean>(false);

  // Assign job when updated (when editing)
  useEffect(() => {
    if (props.existingData !== undefined)
      setData(props.existingData as JobPost);
  }, [props.existingData]);

  // Validates the form, returning whether it was successful
  const validateForm = (): boolean => {
    let error = false;
    if (!!!data.name) {
      setNameError("Name cannot be empty");
      error = true;
    }
    switch (data.task.task_type) {
      case TaskType.EXECUTE_ROOM_ACTION:
        if (!!!data.task.room_id)
          setTaskError((taskError) => ({
            ...taskError,
            room: "Room cannot be empty",
          }));
        if (!!!data.task.action_id)
          setTaskError((taskError) => ({
            ...taskError,
            action: "Action cannot be empty",
          }));
    }
    if (data.trigger.trigger_type === TriggerType.CRON) {
      if (!!!data.trigger.value) {
        setCrontabError("Crontab cannot be empty");
        error = true;
      } else if (data.trigger.value.split(" ").length !== 5) {
        setCrontabError("Crontab must consist of 5 parts separated by spaces");
        error = true;
      }
    }
    return !error;
  };

  const handleChangeData = (newData: JobPost) => {
    if (newData.name !== data.name && !!nameError) setNameError(undefined);

    setData(newData);
  };

  // Reset everything on close
  const handleClose = () => {
    if (props.open === undefined) setOpen(false);
    else if (props.onClose !== undefined) props.onClose();
    setData({
      name: "",
      task: { task_type: TaskType.RECORD_ALL_TEMPERATURES },
      trigger: { trigger_type: TriggerType.CRON, value: "" },
    });
    setNameError(undefined);
    setTaskError({ room: undefined, action: undefined });
    setCrontabError(undefined);
    setOtherError(false);
  };

  const handleFinish = () => {
    if (validateForm()) {
      if (props.existingData === undefined)
        jobAddMutation
          .mutateAsync(data)
          .then(() => handleClose())
          .catch((error) => {
            setOtherError(true);
          });
      else {
        const nameUpdated = data.name !== props.existingData.name;
        const taskUpdated = data.task !== props.existingData.task;
        const triggerUpdated = data.trigger !== props.existingData.trigger;

        if (nameUpdated || taskUpdated || triggerUpdated) {
          jobPatchMutation
            .mutateAsync({
              jobId: props.existingData.id,
              jobData: {
                name: nameUpdated ? data.name : undefined,
                task: taskUpdated ? data.task : undefined,
                trigger: triggerUpdated ? data.trigger : undefined,
              },
            })
            .then(() => handleClose());
        } else handleClose();
      }
    }
  };

  const handleChangeTaskType = (event: SelectChangeEvent<TaskType>) => {
    const newTaskType = event.target.value;

    // Reset task specific errors
    setTaskError({ room: undefined, action: undefined });

    switch (newTaskType) {
      case TaskType.RECORD_ALL_TEMPERATURES:
        setData({ ...data, task: { task_type: newTaskType } });
        break;
      case TaskType.EXECUTE_ROOM_ACTION:
        setData({
          ...data,
          task: { task_type: newTaskType, room_id: "", action_id: "" },
        });
        break;
    }
  };

  const handleChangeTriggerType = (event: SelectChangeEvent<TriggerType>) => {
    const newTriggerType = event.target.value;

    // Reset trigger specific errors
    setCrontabError(undefined);

    switch (newTriggerType) {
      case TriggerType.DATETIME:
        setData({
          ...data,
          trigger: { trigger_type: newTriggerType, value: new Date() },
        });
        break;
      case TriggerType.INTERVAL:
        setData({
          ...data,
          trigger: {
            trigger_type: newTriggerType,
            value: { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
          },
        });
        break;
      case TriggerType.CRON:
        setData({
          ...data,
          trigger: { trigger_type: newTriggerType, value: "" },
        });
        break;
    }
  };

  const getTaskInput = () => {
    switch (data.task.task_type) {
      case TaskType.RECORD_ALL_TEMPERATURES:
        return null;
      case TaskType.EXECUTE_ROOM_ACTION:
        return (
          <Grid item>
            <ExecuteRoomActionTaskForm
              task={data.task}
              taskError={taskError}
              setTaskError={setTaskError}
              onTaskUpdated={(newTask: TaskExecuteRoomAction) =>
                setData({ ...data, task: newTask })
              }
            />
          </Grid>
        );
    }
  };

  const getTriggerInput = () => {
    switch (data.trigger.trigger_type) {
      case TriggerType.DATETIME:
        return (
          <Grid item>
            <MobileDateTimePicker
              label="Datetime"
              value={dayjs(data.trigger.value)}
              onChange={(newValue) =>
                handleChangeData({
                  ...data,
                  trigger: {
                    trigger_type: TriggerType.DATETIME,
                    value: newValue?.toDate() || new Date(),
                  },
                })
              }
              sx={{ width: "100%" }}
            />
          </Grid>
        );
      case TriggerType.INTERVAL:
        return (
          <>
            <Grid item>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <TextField
                    label="Weeks"
                    value={data.trigger.value.weeks}
                    required
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...(data.trigger.value as TimeDelta),
                            weeks: Number(event.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Days"
                    value={data.trigger.value.days}
                    required
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...(data.trigger.value as TimeDelta),
                            days: Number(event.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Hours"
                    value={data.trigger.value.hours}
                    required
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...(data.trigger.value as TimeDelta),
                            hours: Number(event.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label="Minutes"
                    value={data.trigger.value.minutes}
                    required
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...(data.trigger.value as TimeDelta),
                            minutes: Number(event.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Seconds"
                    value={data.trigger.value.seconds}
                    required
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...(data.trigger.value as TimeDelta),
                            seconds: Number(event.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case TriggerType.CRON:
        return (
          <Grid item>
            <TextField
              label="Crontab"
              value={data.trigger.value}
              required
              onChange={(event) =>
                handleChangeData({
                  ...data,
                  trigger: {
                    ...data.trigger,
                    trigger_type: TriggerType.CRON,
                    value: event.target.value,
                  },
                })
              }
              error={!!crontabError}
              helperText={crontabError}
              fullWidth
            />
          </Grid>
        );
    }
  };

  return (
    <>
      {props.renderButton !== undefined
        ? props.renderButton(() => setOpen(true))
        : null}
      <Dialog
        open={props.open !== undefined ? props.open : open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{props.existingData ? "Edit Job" : "Add Job"}</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2} sx={{ paddingTop: 1 }}>
            <Grid item>
              <TextField
                label="Name"
                value={data.name}
                required
                onChange={(event) =>
                  handleChangeData({ ...data, name: event.target.value })
                }
                error={!!nameError}
                helperText={nameError}
                fullWidth
              />
            </Grid>
            <Grid item>
              <FormControl required fullWidth>
                <InputLabel id="task-select-label">Task</InputLabel>
                <Select
                  labelId="task-select-label"
                  id="task-select"
                  label="Task"
                  value={data.task.task_type}
                  onChange={handleChangeTaskType}
                >
                  {Object.keys(TaskType).map((type) => (
                    <MenuItem
                      key={type}
                      value={TaskType[type as keyof typeof TaskType]}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {getTaskInput()}
            <Grid item>
              <FormControl required fullWidth>
                <InputLabel id="trigger-type-select-label">
                  Trigger Type
                </InputLabel>
                <Select
                  labelId="trigger-type-select-label"
                  id="trigger-type-select"
                  label="Trigger Type"
                  value={data.trigger.trigger_type}
                  onChange={handleChangeTriggerType}
                >
                  {Object.keys(TriggerType).map((type) => (
                    <MenuItem
                      key={type}
                      value={TriggerType[type as keyof typeof TriggerType]}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {getTriggerInput()}
          </Grid>
          {otherError && (
            <FormHelperText error>An unexpected error occurred</FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleFinish}>
            {props.existingData === undefined ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
