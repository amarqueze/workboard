import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTaskRequest } from "../app.types";
import { updateTask } from "../api/tasks-api";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTaskRequest) =>
      updateTask(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}