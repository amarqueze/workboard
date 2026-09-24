import { useQuery } from "@tanstack/react-query";
import type { ListTasksRequest, ListTasksResult } from "../app.types";
import { listTasks } from "../api/tasks-api";

export function useTasks(
  filters: ListTasksRequest = {},
) {
  return useQuery<ListTasksResult>({
    queryKey: [
      "tasks",
      filters,
    ],
    queryFn: () => listTasks(filters),
    refetchInterval: 10000,
  });
}