import type { Toast as ToastModel } from "./toast.types";

type ToastProps = {
  toast: ToastModel;
  onClose: (id: number) => void;
};

function Toast({ toast, onClose }: ToastProps) {
  return (
    <article
      className={`toast toast--${toast.type}`}
      role="status"
    >
      <div className="toast__content">
        <strong className="toast__title">
          {toast.title}
        </strong>

        <p className="toast__message">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        className="toast__close"
        aria-label="Close notification"
        onClick={() => onClose(toast.id)}
      >
        ×
      </button>
    </article>
  );
}

export default Toast;