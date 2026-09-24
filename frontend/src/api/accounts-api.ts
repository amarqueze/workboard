import type { 
  LoginAccountRequest, 
  LoginAccountResponse, 
  GetAccountInfoResponse, 
  ListAccountsResponse, 
  RegisterAccountApiResponse, 
  RegisterAccountRequest } from "../app.types";
import { httpClient } from "./http-client";

export async function loginAccount(
  payload: LoginAccountRequest,
) {
  const response =
    await httpClient.post<LoginAccountResponse>(
      "/accounts/login/",
      payload,
    );

  return response.data.data;
}

export async function getAccountInfo(
  email: string,
) {
  const response =
    await httpClient.get<GetAccountInfoResponse>(
      "/accounts/user-info/",
      {
        params: {
          email,
        },
      },
    );

  return response.data.data;
}

export async function listAccounts() {
  const response =
    await httpClient.get<ListAccountsResponse>(
      "/accounts/",
    );

  return response.data.data;
}

export async function registerAccount(
  payload: RegisterAccountRequest,
) {
  const response =
    await httpClient.post<RegisterAccountApiResponse>(
      "/accounts/register/",
      payload,
    );

  return response.data.data;
}