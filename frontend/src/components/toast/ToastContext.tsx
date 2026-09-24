import { createContext } from "react";

import type { ShowToastOptions } from "./toast.types";

export type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
};

export const ToastContext =
  createContext<ToastContextValue | null>(null);