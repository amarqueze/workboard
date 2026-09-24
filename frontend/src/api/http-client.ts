import axios, { isAxiosError } from "axios";
import type { ApiErrorResponse } from "../app.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setHttpAuthToken(accessToken: string | null) {
  if (accessToken === null) {
    delete httpClient.defaults.headers.common.Authorization;
    return;
  }

  httpClient.defaults.headers.common.Authorization =
    `Bearer ${accessToken}`;
}

export function getErrorMessage(error: unknown, defaultError: string = "An error occurred.") {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data.error?.details?.detail ??
      error.response?.data.error?.message ??
      defaultError
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultError;
}