"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
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
import { useEffect, useMemo, useState } from "react";
import {
  useDeleteHueBridge,
  useDiscoverHueBridges,
  useHueBridges,
  useRegisterHueBridge,
} from "../../../../api/hue";
import { LoadingPage } from "../../../../components/LoadingPage";

function DiscoveryStep(props: {
  currentBridges: HueBridge[];
  onSelectBridge: (bridgeDiscoverInfo: HueBridgeDiscoverInfo) => void;
}) {
  // Discovered bridges
  const discoverBridgesQuery = useDiscoverHueBridges();
  const [rows, setRows] = useState<HueBridgeDiscoverInfo[] | undefined>(
    undefined
  );

  // IPs of Bridges that are already known
  const knownBridgeIps = useMemo(
    () => props.currentBridges.map((bridge) => bridge.ip_address),
    [props.currentBridges]
  );

  useEffect(() => {
    if (
      !discoverBridgesQuery.isLoading &&
      discoverBridgesQuery.data !== undefined
    )
      // Filter out any that have already been registered
      setRows(
        discoverBridgesQuery.data.filter(
          (discoverInfo) =>
            !knownBridgeIps.includes(discoverInfo.internalipaddress)
        )
      );
  }, [
    discoverBridgesQuery.isLoading,
    discoverBridgesQuery.data,
    knownBridgeIps,
  ]);

  const discoveredBridgesTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "internalipaddress", headerName: "IP Address", flex: 1 },
    { field: "port", headerName: "Port", flex: 1 },
  ];

  return discoverBridgesQuery.isError ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormHelperText error>
        Unable to discover Hue Bridges (likely due to a rate limit, try using
        mDNS instead)
      </FormHelperText>
    </Box>
  ) : discoverBridgesQuery.isLoading || rows === undefined ? (
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
    <DataGrid
      rows={rows}
      columns={discoveredBridgesTableColumns}
      onRowClick={(params) => {
        props.onSelectBridge(params.row);
      }}
      localeText={{ noRowsLabel: "No new Hue Bridges discovered" }}
      autoHeight
    />
  );
}

const ADD_DIALOGUE_STEPS = ["Select", "Name", "Verify"];

function AddDialogue(props: { currentBridges: HueBridge[] }) {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);

  // Stepper state
  const [activeStep, setActiveStep] = useState<number>(0);

  // Add form state
  const [selectedBridge, setSelectedBridge] = useState<
    HueBridgeDiscoverInfo | undefined
  >(undefined);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const bridgeRegisterMutation = useRegisterHueBridge();

  // Error when trying to register the bridge (on either of last two steps)
  const [registerError, setRegisterError] = useState<string | undefined>();

  // IPs of Bridges that are already known
  const knownBridgeNames = useMemo(
    () => props.currentBridges.map((bridge) => bridge.name),
    [props.currentBridges]
  );

  const handleNameChange = (newName: string) => {
    if (nameError !== undefined) setNameError(undefined);

    setName(newName);
  };

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <DiscoveryStep
            currentBridges={props.currentBridges}
            onSelectBridge={(bridgeDiscoverInfo: HueBridgeDiscoverInfo) => {
              setSelectedBridge(bridgeDiscoverInfo);
              setActiveStep(activeStep + 1);
            }}
          />
        );
      case 1:
        return (
          <>
            <TextField
              label="Name"
              value={name}
              required
              onChange={(event) => handleNameChange(event.target.value)}
              error={!!nameError}
              helperText={nameError}
              fullWidth
            />
          </>
        );
      case 2:
        return (
          registerError === undefined && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5">
                  {
                    "Press the button on the chosen bridge and then click 'Finish'"
                  }
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={40} />
              </Box>
            </>
          )
        );
      default:
        return null;
    }
  };

  // Returns true when valid
  const validateForm = (): boolean => {
    switch (activeStep) {
      case 1:
        if (name.trim() === "") {
          setNameError("You must enter a name");
          return false;
        } else if (knownBridgeNames.includes(name)) {
          setNameError("A Bridge with that name has already been registered");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setRegisterError(undefined);
  };

  const handleNext = async () => {
    if (validateForm()) {
      // Check whether should press button next
      if (activeStep === 1) {
        if (selectedBridge !== undefined)
          // Do initial mutation
          await bridgeRegisterMutation
            .mutateAsync({
              name: name,
              discover_info: selectedBridge,
            })
            .then((response) => {
              if (response === null) {
                setRegisterError(undefined);
                setActiveStep(activeStep + 1);
              }
              // Somehow already succeeded
              else handleClose();
            })
            .catch((error) => {
              setRegisterError("An unexpected error occurred");
            });
      } else setActiveStep(activeStep + 1);
    }
  };

  const handleFinish = async () => {
    if (selectedBridge !== undefined) {
      // Do initial mutation
      await bridgeRegisterMutation
        .mutateAsync({
          name: name,
          discover_info: selectedBridge,
        })
        .then((response) => {
          if (response === null) {
            // Failed - could have been too slow
            setRegisterError(
              "Unable to register device, go back and try again"
            );
          }
          // Success
          else handleClose();
        })
        .catch((error) => {
          setRegisterError("An unexpected error occurred");
        });
    }
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setSelectedBridge(undefined);
    setName("");
    setNameError(undefined);
    setRegisterError(undefined);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add bridge
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Hue Bridge</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
            {ADD_DIALOGUE_STEPS.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
          {registerError !== undefined && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <FormHelperText error>{registerError}</FormHelperText>
            </Box>
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
            <Button
              disabled={activeStep === 0 || activeStep == 2}
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

function Toolbar(props: { currentBridges: HueBridge[] }) {
  return (
    <GridToolbarContainer>
      <AddDialogue currentBridges={props.currentBridges} />
    </GridToolbarContainer>
  );
}

export default function HuePage() {
  // Obtain all the registered Hue bridges
  const bridgesQuery = useHueBridges();

  const [rows, setRows] = useState<HueBridge[] | undefined>(undefined);

  // Mutations
  const deviceDeleteMutation = useDeleteHueBridge();

  useEffect(() => {
    if (!bridgesQuery.isLoading && bridgesQuery.data !== undefined)
      setRows(bridgesQuery.data);
  }, [bridgesQuery.isLoading, bridgesQuery.data]);

  const handleDeleteClicked = async (params: GridRowParams) => {
    await deviceDeleteMutation.mutate(params.id as string);
  };

  const devicesTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "ip_address", headerName: "IP Address", flex: 1 },
    { field: "port", headerName: "IP Address", flex: 1 },
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

  return bridgesQuery.isLoading || rows === undefined ? (
    <LoadingPage />
  ) : (
    <DataGrid
      rows={rows}
      columns={devicesTableColumns}
      slots={{ toolbar: Toolbar }}
      slotProps={{ toolbar: { currentBridges: bridgesQuery.data } }}
      autoHeight
    />
  );
}
