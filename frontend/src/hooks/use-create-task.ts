import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../api/http-client";
import type {
  CreateTaskRequest,
  CreateTaskResponse,
} from "../app.types";
import { createTask } from "../api/tasks-api";



export function useCreateTask() {
  return useMutation<
    CreateTaskResponse,
    Error,
    CreateTaskRequest
  >({
    mutationFn: async (payload) => {
      try {
        return await createTask(payload);
      } catch (error) {
        const message =
          getErrorMessage(error, "Unable to create task.");

        throw new Error(message, {
          cause: error,
        });
      }
    },
  });
}