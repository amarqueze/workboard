import type { ReactNode } from "react";

export type ModalSize = number | string;

export type OpenModalOptions = {
  content: ReactNode;
  width?: ModalSize;
  height?: ModalSize;
  onClose?: () => void;
  onSuccess?: () => void;
};
