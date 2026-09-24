import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateTaskStateRequest } from "../app.types";
import { updateTaskState } from "../api/tasks-api";

export function useUpdateTaskState() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    UpdateTaskStateRequest
  >({
    mutationFn: updateTaskState,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}