import {
  type ReactNode,
  useCallback,
  useState,
} from "react";

import Toast from "./Toast";
import { ToastContext } from "./ToastContext";

import type {
  ShowToastOptions,
  Toast as ToastModel,
} from "./toast.types";

import "./Toast.css";


type ToastProviderProps = {
  children: ReactNode;
};

const DEFAULT_TOAST_DURATION = 4000;

function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastModel[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const id = Date.now();

      const toast: ToastModel = {
        id,
        title: options.title,
        message: options.message,
        type: options.type,
        duration:
          options.duration ?? DEFAULT_TOAST_DURATION,
      };

      setToasts((current) => [
        ...current,
        toast,
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="toast-container"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
