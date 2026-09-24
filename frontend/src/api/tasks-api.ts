import type { 
  CreateTaskApiResponse, 
  CreateTaskRequest, 
  GetTaskStatesApiResponse, 
  ListTasksApiResponse, 
  ListTasksRequest, 
  ListTasksResult, 
  UpdateTaskStateRequest,
  AssignTaskRequest,
} from "../app.types";
import { httpClient } from "./http-client";

export async function createTask(
  payload: CreateTaskRequest,
) {
  const response =
    await httpClient.post<CreateTaskApiResponse>(
      "/tasks/",
      payload,
    );

  return response.data.data;
}


export async function getTaskStates() {
  const response =
    await httpClient.get<GetTaskStatesApiResponse>(
      "/tasks/states/",
    );

  return response.data.data;
}

export async function listTasks(
  filters: ListTasksRequest = {},
): Promise<ListTasksResult> {
  const response =
    await httpClient.post<ListTasksApiResponse>(
      "/tasks/filter/",
      filters,
    );

  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function updateTaskState(
  request: UpdateTaskStateRequest,
): Promise<void> {
  const {
    taskId,
    state,
    updated_by_id,
  } = request;

  await httpClient.patch(
    `/tasks/${taskId}/state/`,
    {
      state,
      updated_by_id,
    },
  );
}


export async function assignTask(
  request: AssignTaskRequest,
): Promise<void> {
  const {
    taskId,
    assigned_to_id,
    updated_by_id,
  } = request;

  await httpClient.patch(
    `/tasks/${taskId}/assign/`,
    {
      assigned_to_id,
      updated_by_id,
    },
  );
}