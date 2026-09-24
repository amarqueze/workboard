import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { setHttpAuthToken } from "../../api/http-client";
import type { AuthTokens, AccountInfo } from "../../app.types";
import { AuthContext } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

type StoredAuth = {
  tokens: AuthTokens;
  data: AccountInfo;
};

const AUTH_STORAGE_KEY = "workboard.auth";

function getStoredAuth(): StoredAuth | null {
  const storedAuth =
    window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (storedAuth === null) {
    return null;
  }

  try {
    return JSON.parse(storedAuth) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function storeAuth(auth: StoredAuth) {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(auth),
  );
}

function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function AuthProvider({
  children,
}: AuthProviderProps) {
  const [auth, setAuthState] =
    useState<StoredAuth | null>(() => {
      const storedAuth = getStoredAuth();

      setHttpAuthToken(
        storedAuth?.tokens.accessToken ?? null,
      );

      return storedAuth;
    });


  const setAuth = useCallback(
    (
      tokens: AuthTokens,
      data: AccountInfo,
    ) => {
      const nextAuth: StoredAuth = {
        tokens,
        data,
      };

      storeAuth(nextAuth);

      setHttpAuthToken(tokens.accessToken);

      setAuthState(nextAuth);
    },
    [],
  );


  const logout = useCallback(() => {
    clearStoredAuth();

    setHttpAuthToken(null);

    setAuthState(null);
  }, []);


  const contextValue = useMemo(
    () => ({
      accessToken:
        auth?.tokens.accessToken ?? null,

      refreshToken:
        auth?.tokens.refreshToken ?? null,

      data:
        auth?.data ?? null,

      isAuthenticated:
        auth !== null,

      setAuth,
      logout,
    }),
    [
      auth,
      logout,
      setAuth,
    ],
  );


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
