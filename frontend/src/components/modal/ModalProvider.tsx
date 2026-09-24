import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ModalContext } from "./ModalContext";

import type { OpenModalOptions } from "./modal.types";

import "./Modal.css";

type ModalProviderProps = {
  children: ReactNode;
};

const DEFAULT_MODAL_WIDTH = "560px";
const DEFAULT_MODAL_HEIGHT = "auto";

function ModalProvider({
  children,
}: ModalProviderProps) {
  const modalRef = useRef<OpenModalOptions | null>(null);
  const [modal, setModal] =
    useState<OpenModalOptions | null>(null);

  const openModal = useCallback(
    (options: OpenModalOptions) => {
      modalRef.current = options;
      setModal(options);
    },
    [],
  );

  const closeModal = useCallback(() => {
    const currentModal = modalRef.current;

    modalRef.current = null;
    setModal(null);

    currentModal?.onClose?.();
  }, []);

  const successModal = useCallback(() => {
    const currentModal = modalRef.current;

    modalRef.current = null;
    setModal(null);

    currentModal?.onSuccess?.();
  }, []);

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    },
    [closeModal],
  );

  useEffect(() => {
    if (modal === null) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, modal]);

  const contextValue = useMemo(
    () => ({
      isOpen: modal !== null,
      openModal,
      closeModal,
      successModal,
    }),
    [
      closeModal,
      modal,
      openModal,
      successModal,
    ],
  );

  const modalStyle: CSSProperties = {
    width: modal?.width ?? DEFAULT_MODAL_WIDTH,
    height: modal?.height ?? DEFAULT_MODAL_HEIGHT,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {modal !== null && (
        <div
          className="modal-overlay"
          onMouseDown={handleOverlayClick}
        >
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            style={modalStyle}
          >
            {modal.content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
