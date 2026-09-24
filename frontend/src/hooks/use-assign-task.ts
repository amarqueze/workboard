import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AssignTaskRequest } from "../app.types";
import { assignTask } from "../api/tasks-api";

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AssignTaskRequest
  >({
    mutationFn: assignTask,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}