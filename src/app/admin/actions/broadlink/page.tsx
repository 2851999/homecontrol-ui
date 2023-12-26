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
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  useAddBroadlinkAction,
  useBroadlinkActions,
  useBroadlinkDevices,
  useDeleteBroadlinkAction,
} from "../../../../api/broadlink";
import {
  BroadlinkAction,
  BroadlinkActionPost,
} from "../../../../api/schemas/broadlink";
import { CircularLoadingIndicator } from "../../../../components/CircularLoadingIndicator";
import { LoadingPage } from "../../../../components/LoadingPage";

function NameStep(props: {
  data: BroadlinkActionPost;
  formErrors: BroadlinkActionPost;
  onChangeName: (name: string) => void;
}) {
  return (
    <Grid container direction="column" spacing={2} sx={{ paddingTop: 1 }}>
      <Grid item>
        <TextField
          label="Name"
          value={props.data.name}
          onChange={(event) => props.onChangeName(event.target.value)}
          error={!!props.formErrors.name}
          helperText={props.formErrors.name}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}

function SelectStep(props: {
  data: BroadlinkActionPost;
  formErrors: BroadlinkActionPost;
  onSelectDevice: (deviceId: string) => void;
}) {
  // Existing devices
  const devicesQuery = useBroadlinkDevices();

  return devicesQuery.isLoading || devicesQuery.data === undefined ? (
    <CircularLoadingIndicator />
  ) : (
    <FormControl fullWidth>
      <InputLabel id="device-select-label">Broadlink Device</InputLabel>
      <Select
        labelId="device-select-label"
        id="device-select"
        label="Broadlink Device"
        value={props.data.device_id}
        onChange={(event) => props.onSelectDevice(event.target.value as string)}
        error={!!props.formErrors.device_id}
      >
        {devicesQuery.data.map((device) => (
          <MenuItem key={device.id} value={device.id}>
            {device.name}
          </MenuItem>
        ))}
      </Select>
      {!!props.formErrors.device_id && (
        <FormHelperText error>{props.formErrors.device_id}</FormHelperText>
      )}
    </FormControl>
  );
}

function RecordStep(props: {
  data: BroadlinkActionPost;
  onClose: () => void;
  onOtherError: () => void;
}) {
  // Whether currently waiting for a device to be recorded
  const [recording, setRecording] = useState<boolean>(false);

  // Mutations
  const deviceAddMutation = useAddBroadlinkAction();

  const handleRecord = () => {
    setRecording(true);
    deviceAddMutation
      .mutateAsync(props.data)
      .then(() => {
        setRecording(false);
        props.onClose();
      })
      .catch((error) => {
        setRecording(false);
        props.onOtherError();
      });
  };

  return (
    <>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item>
          <Typography>
            When ready press the button below to record the action
          </Typography>
        </Grid>
        <Grid item>
          {recording ? (
            <CircularLoadingIndicator />
          ) : (
            <Button variant="contained" onClick={handleRecord}>
              Record
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}

const ADD_DIALOGUE_STEPS = ["Name", "Select device", "Record"];

function AddDialogue() {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<BroadlinkActionPost>({
    device_id: "",
    name: "",
  });
  const [formErrors, setFormErrors] = useState<BroadlinkActionPost>({
    device_id: "",
    name: "",
  });
  const [otherError, setOtherError] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Mutations
  const deviceAddMutation = useAddBroadlinkAction();

  // Validates the form, returning whether it was successful
  const validateForm = (): boolean => {
    switch (activeStep) {
      case 0:
        if (!!!data.name) {
          setFormErrors({
            ...formErrors,
            name: "Name cannot be empty",
          });
          return false;
        } else return true;
      case 1:
        if (!!!data.device_id) {
          setFormErrors({
            ...formErrors,
            device_id: "A device must be selected",
          });
          return false;
        } else return true;
      default:
        return true;
    }
  };

  // Resets appropriate form errors when a field is changed
  const handleFormChange = (newData: BroadlinkActionPost) => {
    if (newData.name != data.name && !!formErrors.name)
      setFormErrors({ ...formErrors, name: "" });
    else if (newData.device_id !== data.device_id && !!formErrors.device_id)
      setFormErrors({ ...formErrors, device_id: "" });

    setData(newData);
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setData({ device_id: "", name: "" });
    setFormErrors({ device_id: "", name: "" });
    setOtherError(false);
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Validates then sends request
  const handleNext = () => {
    // Validate
    if (validateForm()) setActiveStep(activeStep + 1);
  };

  // Validates and then sends the request
  const handleFinish = () => {
    deviceAddMutation
      .mutateAsync(data)
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        setOtherError(true);
      });
  };

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <NameStep
            data={data}
            formErrors={formErrors}
            onChangeName={(name: string) => {
              handleFormChange({ ...data, name: name });
            }}
          />
        );
      case 1:
        return (
          <SelectStep
            data={data}
            formErrors={formErrors}
            onSelectDevice={(deviceId: string) => {
              handleFormChange({ ...data, device_id: deviceId });
            }}
          />
        );
      case 2:
        return (
          <RecordStep
            data={data}
            onClose={handleClose}
            onOtherError={() => setOtherError(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add action
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add action</DialogTitle>
        {deviceAddMutation.isPending ? (
          <DialogContent>
            <CircularLoadingIndicator />
          </DialogContent>
        ) : (
          <>
            <DialogContent>
              <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
                {ADD_DIALOGUE_STEPS.map((label, index) => (
                  <Step key={label} completed={activeStep > index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {getStepContent(activeStep)}
              {otherError && (
                <FormHelperText error>
                  An unexpected error occurred
                </FormHelperText>
              )}
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
          </>
        )}
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

export default function BroadlinkActionsPage() {
  // Obtain all the registered broadlink actions
  const actionsQuery = useBroadlinkActions();

  const [rows, setRows] = useState<BroadlinkAction[] | undefined>(undefined);

  // Mutations
  const actionDeleteMutation = useDeleteBroadlinkAction();

  useEffect(() => {
    if (!actionsQuery.isLoading && actionsQuery.data !== undefined)
      setRows(actionsQuery.data);
  }, [actionsQuery.isLoading, actionsQuery.data]);

  const handleDeleteClicked = async (params: GridRowParams) => {
    await actionDeleteMutation.mutate(params.id as string);
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

  return actionsQuery.isLoading || rows === undefined ? (
    <LoadingPage />
  ) : (
    // eslint-disable-next-line react/jsx-no-undef
    <DataGrid
      rows={rows}
      columns={actionsTableColumns}
      slots={{ toolbar: Toolbar }}
      autoHeight
    />
  );
}
