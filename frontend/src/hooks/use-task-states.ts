import { useQuery } from "@tanstack/react-query";
import type { TaskState } from "../app.types";
import { getTaskStates } from "../api/tasks-api";

const TASK_STATES_QUERY_KEY = [
  "task-states",
];

export function useTaskStates() {
  return useQuery<TaskState[]>({
    queryKey: TASK_STATES_QUERY_KEY,
    queryFn: getTaskStates,
  });
}