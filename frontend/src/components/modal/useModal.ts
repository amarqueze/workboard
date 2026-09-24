import { useContext } from "react";

import { ModalContext } from "./ModalContext";

export function useModal() {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error(
      "useModal must be used inside ModalProvider",
    );
  }

  return context;
}
