"use client";

import {
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  useAddJob,
  useAvailableTasks,
  useDeleteJob,
  useJobs,
} from "../../../../api/scheduler";

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
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { LoadingPage } from "../../../../components/LoadingPage";
import { JobPost, TriggerType } from "../../../../api/schemas/scheduler";
import { CircularLoadingIndicator } from "../../../../components/CircularLoadingIndicator";
import { DateTimePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function AddDialogue() {
  // Available tasks
  const availableTasksQuery = useAvailableTasks();

  // Mutations
  const jobAddMutation = useAddJob();

  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  const [data, setData] = useState<JobPost>({
    name: "",
    task: "",
    trigger: { trigger_type: TriggerType.CRON, value: "" },
  });
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [taskError, setTaskError] = useState<string | undefined>(undefined);
  const [crontabError, setCrontabError] = useState<string | undefined>(
    undefined
  );

  const [otherError, setOtherError] = useState<boolean>(false);

  // Validates the form, returning whether it was successful
  const validateForm = (): boolean => {
    let error = false;
    if (!!!data.name) {
      setNameError("Name cannot be empty");
      error = true;
    }
    if (!!!data.task) {
      setTaskError("Task cannot be empty");
      error = true;
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
    if (newData.task !== data.task && !!taskError) setTaskError(undefined);

    setData(newData);
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setData({
      name: "",
      task: "",
      trigger: { trigger_type: TriggerType.CRON, value: "" },
    });
    setNameError(undefined);
    setTaskError(undefined);
    setCrontabError(undefined);
    setOtherError(false);
  };

  const handleAdd = () => {
    if (validateForm())
      jobAddMutation
        .mutateAsync(data)
        .then(() => handleClose())
        .catch((error) => {
          setOtherError(true);
        });
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
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...data.trigger.value,
                            weeks: event.target.value,
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
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...data.trigger.value,
                            days: event.target.value,
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
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...data.trigger.value,
                            hours: event.target.value,
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
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...data.trigger.value,
                            minutes: event.target.value,
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
                    type="number"
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        trigger: {
                          ...data.trigger,
                          trigger_type: TriggerType.INTERVAL,
                          value: {
                            ...data.trigger.value,
                            seconds: event.target.value,
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
            {" "}
            <TextField
              label="Crontab"
              value={data.trigger.value}
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
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Job
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Job</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2} sx={{ paddingTop: 1 }}>
            <Grid item>
              <TextField
                label="Name"
                value={data.name}
                onChange={(event) =>
                  handleChangeData({ ...data, name: event.target.value })
                }
                error={!!nameError}
                helperText={nameError}
                fullWidth
              />
            </Grid>
            <Grid item>
              {availableTasksQuery.isLoading ||
              availableTasksQuery.data === undefined ? (
                <CircularLoadingIndicator />
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="task-select-label">Task</InputLabel>
                  <Select
                    labelId="task-select-label"
                    id="task-select"
                    label="Task"
                    value={data.task}
                    onChange={(event) =>
                      handleChangeData({
                        ...data,
                        task: event.target.value as string,
                      })
                    }
                    error={!!taskError}
                  >
                    {availableTasksQuery.data.map((task) => (
                      <MenuItem key={task} value={task}>
                        {task}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!taskError && (
                    <FormHelperText error>{taskError}</FormHelperText>
                  )}
                </FormControl>
              )}
            </Grid>
            <Grid item>
              <FormControl fullWidth>
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
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Toolbar() {
  return (
    <GridToolbarContainer>
      <AddDialogue />
    </GridToolbarContainer>
  );
}

export default function JobsPage() {
  // Obtain all jobs
  const jobsQuery = useJobs();

  // Mutations
  const jobDeleteMutation = useDeleteJob();

  const handleDeleteClicked = async (params: GridRowParams) => {
    await jobDeleteMutation.mutate(params.id as string);
  };

  const jobsTableColumns: GridColDef[] = [
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

  return jobsQuery.isLoading || jobsQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    // eslint-disable-next-line react/jsx-no-undef
    <DataGrid
      rows={jobsQuery.data}
      slots={{ toolbar: Toolbar }}
      columns={jobsTableColumns}
      autoHeight
    />
  );
}
