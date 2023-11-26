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
  Grid,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  useAddBroadlinkDevice,
  useBroadlinkDevices,
  useDeleteBroadlinkDevice,
} from "../../../../api/broadlink";
import {
  BroadlinkDevice,
  BroadlinkDevicePost,
} from "../../../../api/schemas/broadlink";
import { LoadingPage } from "../../../../components/LoadingPage";

// TODO: Unify this dialog and the one for AC as identical (apart from types)

function AddDialogue() {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<BroadlinkDevicePost>({
    name: "",
    ip_address: "",
  });
  const [formErrors, setFormErrors] = useState<BroadlinkDevicePost>({
    name: "",
    ip_address: "",
  });
  const [otherError, setOtherError] = useState<boolean>(false);

  // Mutations
  const deviceAddMutation = useAddBroadlinkDevice();

  // Validates the form, returning any errors to display
  const validateForm = (): BroadlinkDevicePost => {
    return {
      name: !!!data.name ? "Name cannot be empty" : "",
      ip_address: !!!data.ip_address
        ? "IP address cannot be empty"
        : new RegExp("^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d).?\\b){4}$").test(
            data.ip_address
          )
        ? ""
        : "Invalid IP address",
    };
  };

  // Resets appropriate form errors when a field is changed
  const handleFormChange = (newData: BroadlinkDevicePost) => {
    if (newData.name != data.name && !!formErrors.name)
      setFormErrors({ ...formErrors, name: "" });
    if (newData.ip_address != data.ip_address && !!formErrors.ip_address)
      setFormErrors({ ...formErrors, ip_address: "" });

    setData(newData);
  };

  // Validates then sends request
  const handleAdd = () => {
    // Validate
    const newErrors = validateForm();
    if (!!newErrors.name || !!newErrors.ip_address) setFormErrors(newErrors);
    else {
      deviceAddMutation
        .mutateAsync(data)
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          if (isAxiosError(error) && error.response?.status === 404)
            setFormErrors({ ...formErrors, ip_address: "Device not found" });
          else setOtherError(true);
        });
    }
  };

  // Reset everything on close
  const handleClose = () => {
    setOpen(false);
    setData({ name: "", ip_address: "" });
    setFormErrors({ name: "", ip_address: "" });
    setOtherError(false);
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add device
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add device</DialogTitle>
        {deviceAddMutation.isPending ? (
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          </DialogContent>
        ) : (
          <>
            <DialogContent>
              <Grid
                container
                direction="column"
                spacing={2}
                sx={{ paddingTop: 1 }}
              >
                <Grid item>
                  <TextField
                    label="Name"
                    value={data.name}
                    onChange={(event) =>
                      handleFormChange({ ...data, name: event.target.value })
                    }
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="IP Address"
                    value={data.ip_address}
                    onChange={(event) =>
                      handleFormChange({
                        ...data,
                        ip_address: event.target.value,
                      })
                    }
                    error={!!formErrors.ip_address}
                    helperText={formErrors.ip_address}
                    fullWidth
                  />
                </Grid>
              </Grid>
              {otherError && (
                <FormHelperText error>
                  An unexpected error occurred
                </FormHelperText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAdd}>Add</Button>
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

export default function BroadlinkPage() {
  // Obtain all the registered broadlink devices
  const devicesQuery = useBroadlinkDevices();

  const [rows, setRows] = useState<BroadlinkDevice[] | undefined>(undefined);

  // Mutations
  const deviceDeleteMutation = useDeleteBroadlinkDevice();

  useEffect(() => {
    if (!devicesQuery.isLoading && devicesQuery.data !== undefined)
      setRows(devicesQuery.data);
  }, [devicesQuery.isLoading, devicesQuery.data]);

  const handleDeleteClicked = async (params: GridRowParams) => {
    await deviceDeleteMutation.mutate(params.id as string);
  };

  const devicesTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "ip_address", headerName: "IP Address", flex: 1 },
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

  return devicesQuery.isLoading || rows === undefined ? (
    <LoadingPage />
  ) : (
    <DataGrid
      rows={rows}
      columns={devicesTableColumns}
      slots={{ toolbar: Toolbar }}
    />
  );
}
