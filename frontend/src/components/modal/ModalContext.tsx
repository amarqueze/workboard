import { createContext } from "react";

import type { OpenModalOptions } from "./modal.types";

export type ModalContextValue = {
  isOpen: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;
  successModal: () => void;
};

export const ModalContext =
  createContext<ModalContextValue | null>(null);
