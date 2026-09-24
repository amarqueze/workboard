
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginAccountRequest = {
  email: string;
  password: string;
};

export type LoginAccountTokens = {
  access_token: string;
  refresh_token: string;
};

export type AccountInfo = {
  account_id: number;
  email: string;
  name: string;
  last_name: string;
  role: string;
};

export type ListAccountsResponse = {
  data: AccountInfo[];
};

export type LoginAccountResponse = {
  data: LoginAccountTokens;
};

export type GetAccountInfoResponse = {
  data: AccountInfo;
};

export type CreateTaskRequest = {
  name: string;
  description?: string;
  due_date: string;
  created_by_id: number;
  assigned_to_id?: number | null;
  state: string;
};


export type CreateTaskResponse = {
  status: string;
};

export type TaskState = {
  id: number;
  name: string;
};

export type CreateTaskApiResponse = {
  data: CreateTaskResponse;
};

export type GetTaskStatesApiResponse = {
  data: TaskState[];
};

export type RegisterAccountRequest = {
  email: string;
  password: string;
  name: string;
  last_name: string;
  role: string;
};

export type RegisterAccountResponse = {
  account_id: number;
  username: string;
  email: string;
  name: string;
  last_name: string;
  role: string;
};

export type RegisterAccountApiResponse = {
  data: RegisterAccountResponse;
};

export type ListTasksRequest = {
  name_prefix?: string;
  state?: string;
  due_date?: string;
  page?: number;
  page_size?: number;
};

export type TaskItem = {
  id: number;
  name: string;
  description: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  assigned_to: string | null;
  state: string;
};

export type ListTasksMeta = {
  total: number;
  page: number;
  page_size: number;
};

export type ListTasksResult = {
  data: TaskItem[];
  meta: ListTasksMeta;
};

export type ListTasksApiResponse = {
  data: TaskItem[];
  meta: ListTasksMeta;
};

export type UpdateTaskStateRequest = {
  taskId: number;
  state: string;
  updated_by_id: number;
};

export type AssignTaskRequest = {
  taskId: number;
  assigned_to_id: number;
  updated_by_id: number;
};

export type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: {
      detail: string;
    };
  };
};