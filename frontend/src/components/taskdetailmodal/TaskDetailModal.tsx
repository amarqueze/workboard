import {
  type FormEvent,
  useState,
} from "react";

import "./TaskDetailModal.css";
import type { TaskItem } from "../../app.types";

export type TaskDetailModalTask = {
  id: number;
  name: string;
  description: string;
  state: string;
  assigned_to: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  due_date: string;
};

export type TaskDetailModalValues = {
  id: number;
  name: string;
  description: string;
};

type TaskDetailModalProps = {
  task: TaskItem;
  onClose: () => void;
  onUpdate: (values: TaskDetailModalValues) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function TaskDetailModal({
  task,
  onClose,
  onUpdate,
}: TaskDetailModalProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(
    task.description,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onUpdate({
      id: task.id,
      name,
      description,
    });
  }

  return (
    <form
      className="task-detail-modal"
      onSubmit={handleSubmit}
    >
      <header className="task-detail-modal__header">
        <h2 className="task-detail-modal__title">
          Task #{task.id}
        </h2>

        <button
          type="button"
          className="task-detail-modal__close"
          aria-label="Close task detail"
          onClick={onClose}
        >
          x
        </button>
      </header>

      <div className="task-detail-modal__body">
        <div className="field">
          <label
            className="field__label"
            htmlFor={`task-detail-name-${task.id}`}
          >
            Name
          </label>

          <input
            id={`task-detail-name-${task.id}`}
            className="input"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>

        <div className="field">
          <label
            className="field__label"
            htmlFor={`task-detail-description-${task.id}`}
          >
            Description
          </label>

          <textarea
            id={`task-detail-description-${task.id}`}
            className="textarea task-detail-modal__description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </div>

        <dl className="task-detail-modal__metadata">
          <div className="task-detail-modal__metadata-item">
            <dt>Created by</dt>
            <dd>{task.created_by.name}</dd>
          </div>

          <div className="task-detail-modal__metadata-item">
            <dt>Updated by</dt>
            <dd>{task.updated_by?.name ?? "N/A"}</dd>
          </div>

          <div className="task-detail-modal__metadata-item">
            <dt>Created at</dt>
            <dd>{formatDate(task.created_at)}</dd>
          </div>

          <div className="task-detail-modal__metadata-item">
            <dt>Updated at</dt>
            <dd>{formatDate(task.updated_at)}</dd>
          </div>

          <div className="task-detail-modal__metadata-item">
            <dt>Due date</dt>
            <dd>{formatDate(task.due_date)}</dd>
          </div>

          <div className="task-detail-modal__metadata-item">
            <dt>State</dt>
            <dd>{task.state}</dd>
          </div>
        </dl>
      </div>

      <footer className="task-detail-modal__footer">
        <button
          type="submit"
          className="button button--primary"
        >
          Update
        </button>
      </footer>
    </form>
  );
}

export default TaskDetailModal;
