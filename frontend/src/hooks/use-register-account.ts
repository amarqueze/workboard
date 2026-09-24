import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  RegisterAccountRequest,
  RegisterAccountResponse,
} from "../app.types";
import { registerAccount } from "../api/accounts-api";
import { getErrorMessage } from "../api/http-client";


export function useRegisterAccount() {
  const queryClient = useQueryClient();

  return useMutation<
    RegisterAccountResponse,
    Error,
    RegisterAccountRequest
  >({
    mutationFn: async (payload) => {
      try {
        return await registerAccount(payload);
      } catch (error) {
        const message =
          getErrorMessage(error, "Unable to create account.");

        throw new Error(message, {
          cause: error,
        });
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
}