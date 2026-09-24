import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/tasks-api";
import type { DeleteTaskRequest } from "../app.types";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteTaskRequest) =>
      deleteTask(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}