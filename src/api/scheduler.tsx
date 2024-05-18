import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authenticated_api } from "./auth";
import { Job, JobPatch, JobPost } from "./schemas/scheduler";

const fetchJobs = (): Promise<Job[]> => {
  return authenticated_api
    .get("/scheduler/jobs")
    .then((response) => response.data);
};

export const useJobs = (): UseQueryResult<Job[], AxiosError> => {
  return useQuery<Job[], AxiosError>({
    queryKey: ["Jobs"],
    queryFn: fetchJobs,
  });
};

const postJob = (job: JobPost): Promise<Job> => {
  return authenticated_api
    .post("/scheduler/jobs", job)
    .then((response) => response.data);
};

export const useAddJob = (): UseMutationResult<
  Job,
  AxiosError,
  JobPost,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job: JobPost) => postJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Jobs"] });
    },
  });
};

const patchJob = (jobId: string, jobData: JobPatch): Promise<Job> => {
  return authenticated_api
    .patch(`/scheduler/jobs/${jobId}`, jobData)
    .then((response) => response.data);
};

export const usePatchJob = (): UseMutationResult<
  Job,
  AxiosError,
  { jobId: string; jobData: JobPatch },
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { jobId: string; jobData: JobPatch }) =>
      patchJob(data.jobId, data.jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Jobs"] });
    },
  });
};

const deleteJob = (jobId: string): Promise<void> => {
  return authenticated_api.delete(`/scheduler/jobs/${jobId}`);
};

export const useDeleteJob = (): UseMutationResult<
  void,
  AxiosError,
  string,
  any
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Jobs"] });
    },
  });
};
