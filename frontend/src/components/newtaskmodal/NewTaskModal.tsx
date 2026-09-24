import {
  type FormEvent,
  useState,
} from "react";

import "./NewTaskModal.css";

export type NewTaskModalValues = {
  name: string;
  description: string;
  due_date: string;
};

type NewTaskModalProps = {
  onClose: () => void;
  onCreate: (values: NewTaskModalValues) => void;
};

function NewTaskModal({
  onClose,
  onCreate,
}: NewTaskModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate({
      name,
      description,
      due_date: dueDate,
    });
  }

  return (
    <form
      className="new-task-modal"
      onSubmit={handleSubmit}
    >
      <header className="new-task-modal__header">
        <h2 className="new-task-modal__title">
          New Task
        </h2>

        <button
          type="button"
          className="new-task-modal__close"
          aria-label="Close new task"
          onClick={onClose}
        >
          x
        </button>
      </header>

      <div className="new-task-modal__body">
        <div className="field">
          <label
            className="field__label"
            htmlFor="new-task-name"
          >
            Name
          </label>

          <input
            id="new-task-name"
            className="input"
            type="text"
            value={name}
            required
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>

        <div className="field">
          <label
            className="field__label"
            htmlFor="new-task-description"
          >
            Description
          </label>

          <textarea
            id="new-task-description"
            className="textarea new-task-modal__description"
            value={description}
            required
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </div>

        <div className="field">
          <label
            className="field__label"
            htmlFor="new-task-due-date"
          >
            Due date
          </label>

          <input
            id="new-task-due-date"
            className="input"
            type="date"
            value={dueDate}
            required
            onChange={(event) => {
              setDueDate(event.target.value);
            }}
          />
        </div>
      </div>

      <footer className="new-task-modal__footer">
        <button
          type="submit"
          className="button button--primary"
        >
          Create
        </button>
      </footer>
    </form>
  );
}

export default NewTaskModal;
