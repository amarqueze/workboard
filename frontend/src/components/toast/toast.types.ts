export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export type Toast = {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  duration: number;
};

export type ShowToastOptions = {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
};