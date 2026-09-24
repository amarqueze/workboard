import { useQuery } from "@tanstack/react-query";
import type { AccountInfo } from "../app.types";
import { listAccounts } from "../api/accounts-api";

const ACCOUNTS_QUERY_KEY = ["accounts"];

export function useAccounts() {
  return useQuery<AccountInfo[]>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: listAccounts,
  });
}