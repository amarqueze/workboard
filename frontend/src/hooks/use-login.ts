import { getErrorMessage } from "../api/http-client";
import {
  useCallback,
  useState,
} from "react";

import {
  getAccountInfo,
  loginAccount,
} from "../api/accounts-api";

import type {
  LoginAccountRequest,
} from "../app.types";

import { useAuth } from "./use-auth";
import { setHttpAuthToken } from "../api/http-client";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuth();

  const login = useCallback(
    async (
      credentials: LoginAccountRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const tokens = await loginAccount(
          credentials,
        );

        setHttpAuthToken(tokens.access_token);
        const accountInfo = await getAccountInfo(
          credentials.email,
        );

        setAuth(
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          },
          accountInfo,
        );
      } catch (unknownError) {
        setHttpAuthToken(null);
        const message =
          getErrorMessage(unknownError, "Unable to sign in.");

        setError(message);

        console.error(
          "Error during login:",
          unknownError,
        );
        throw new Error(message, { cause: unknownError });
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clearError,
    error,
    isLoading,
    login,
  };
}