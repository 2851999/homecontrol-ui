"use client";

import AddIcon from "@mui/icons-material/Add";
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
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useACDevices, useAddACDevice } from "../../../../api/aircon";
import { LoadingPage } from "../../../../components/LoadingPage";
import { ACDevicePost } from "../../../../api/schemas/aircon";

function AddDialogue() {
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ACDevicePost>({ name: "", ip_address: "" });
  const [formErrors, setFormErrors] = useState<ACDevicePost>({
    name: "",
    ip_address: "",
  });
  const [otherError, setOtherError] = useState<boolean>(false);

  // Mutations
  const deviceAddMutation = useAddACDevice();

  // Validates the form, returning any errors to display
  const validateForm = (): ACDevicePost => {
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
  const handleFormChange = (newData: ACDevicePost) => {
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
        .catch(() => {
          setOtherError(true);
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

export default function ACPage() {
  // Obtain all the registered AC units
  const devicesQuery = useACDevices();

  const [rows, setRows] = useState<ACDevice[] | undefined>(undefined);

  useEffect(() => {
    if (!devicesQuery.isLoading && devicesQuery.data !== undefined)
      setRows(devicesQuery.data);
  }, [devicesQuery.isLoading, devicesQuery.data]);

  const devicesTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "ip_address", headerName: "IP Address", flex: 1 },
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
