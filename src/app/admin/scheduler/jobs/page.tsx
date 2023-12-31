"use client";

import {
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { useDeleteJob, useJobs, usePatchJob } from "../../../../api/scheduler";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Job, JobStatus } from "../../../../api/schemas/scheduler";
import { LoadingPage } from "../../../../components/LoadingPage";
import EditIcon from "@mui/icons-material/Edit";

function Toolbar() {
  return (
    <GridToolbarContainer>
      <JobDialogue
        renderButton={(onClick) => (
          <Button startIcon={<AddIcon />} onClick={onClick}>
            Add Job
          </Button>
        )}
      />
    </GridToolbarContainer>
  );
}

import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { JobDialogue } from "../../../../components/JobDialog";
import { useState } from "react";

export default function JobsPage() {
  // Obtain all jobs
  const jobsQuery = useJobs();

  // State of edit component
  const [editJobData, setEditJobData] = useState<Job | undefined>();

  // Mutations
  const JobPatchMutation = usePatchJob();
  const jobDeleteMutation = useDeleteJob();

  const handlePauseResumeClicked = async (params: GridRowParams) => {
    await JobPatchMutation.mutate({
      jobId: params.row.id,
      jobData: {
        status:
          params.row.status === JobStatus.ACTIVE
            ? JobStatus.PAUSED
            : JobStatus.ACTIVE,
      },
    });
  };

  const handleDeleteClicked = async (params: GridRowParams) => {
    await jobDeleteMutation.mutate(params.id as string);
  };

  const jobsTableColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params: GridRowParams) => {
        const active = params.row.status === JobStatus.ACTIVE;

        return [
          <GridActionsCellItem
            icon={active ? <PauseIcon /> : <PlayArrowIcon />}
            label={active ? "Pause" : "Resume"}
            key={active ? "pause" : "resume"}
            onClick={() => handlePauseResumeClicked(params)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            key="edit"
            onClick={() => setEditJobData(params.row)}
          />,
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
    <>
      <JobDialogue
        existingData={editJobData}
        open={editJobData !== undefined}
        onClose={() => setEditJobData(undefined)}
      />
      <DataGrid
        rows={jobsQuery.data}
        slots={{ toolbar: Toolbar }}
        columns={jobsTableColumns}
        autoHeight
      />
    </>
  );
}
