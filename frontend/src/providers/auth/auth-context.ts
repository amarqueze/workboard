import { createContext } from "react";
import type { AccountInfo, AuthTokens } from "../../app.types";

export type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  data: AccountInfo | null;
  isAuthenticated: boolean;

  setAuth: (
    tokens: AuthTokens,
    data: AccountInfo,
  ) => void;

  logout: () => void;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);
