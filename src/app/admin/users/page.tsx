"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { Chip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useDeleteUser, useEditUser, useUsers } from "../../../api/auth";
import { User, UserPatch } from "../../../api/schemas/auth";
import { LoadingPage } from "../../../components/LoadingPage";

export default function UsersPage() {
  // Obtain a list of all users
  const usersQuery = useUsers();

  // User mutations
  const userEditMutation = useEditUser();
  const userDeleteMutation = useDeleteUser();

  // Handles updating data in the table by mutating the user
  // prior to rendering the new values
  const handleProcessRowUpdate = async (newRow: User, oldRow: User) => {
    if (newRow != oldRow) {
      // Update
      let userPatch: UserPatch = {};
      if (newRow.account_type != oldRow.account_type)
        userPatch.account_type = newRow.account_type;
      if (newRow.enabled != oldRow.enabled) userPatch.enabled = newRow.enabled;

      newRow = await userEditMutation.mutateAsync({
        userId: oldRow.id,
        userData: userPatch,
      });
    }
    return newRow;
  };

  const handleDeleteClicked = async (params: GridRowParams) => {
    await userDeleteMutation.mutate(params.id as string);
  };

  // Columns for the users table
  const usersTableColumns: GridColDef[] = [
    { field: "id", headerName: "User ID", flex: 1 },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "account_type",
      headerName: "Account Type",
      type: "singleSelect",
      valueOptions: ["admin", "default"],
      editable: true,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Chip
          label={params.value}
          color={params.value == "default" ? "primary" : "secondary"}
        />
      ),
    },
    {
      field: "enabled",
      headerName: "Enabled?",
      type: "boolean",
      editable: true,
      flex: 1,
    },
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

  return usersQuery.isLoading || usersQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <DataGrid
      rows={usersQuery.data}
      columns={usersTableColumns}
      processRowUpdate={handleProcessRowUpdate}
    />
  );
}
