"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useUsers } from "../../../api/auth";
import { LoadingPage } from "../../../components/LoadingPage";
import { Checkbox, Chip } from "@mui/material";

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
    // editable: true,
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
    // editable: true,
    flex: 1,
  },
];

export default function UsersPage() {
  const usersQuery = useUsers();

  return usersQuery.isLoading || usersQuery.data === undefined ? (
    <LoadingPage />
  ) : (
    <DataGrid rows={usersQuery.data} columns={usersTableColumns}></DataGrid>
  );
}
