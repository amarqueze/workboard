import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./NewTaskModal.css";

import { useCreateTask } from "../../hooks/use-create-task";
import { useToast } from "../toast/useToast";

const newTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(150, "Name is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  due_date: z
    .string()
    .min(1, "Due date is required"),
});

type NewTaskFormValues = z.infer<typeof newTaskSchema>;

type NewTaskModalProps = {
  createdById: number;
  onCreate: () => void;
  onClose: () => void;
};

function formatDueDateForApi(value: string) {
  return `${value}T18:00:00Z`;
}

function NewTaskModal({
  createdById,
  onCreate,
  onClose,
}: NewTaskModalProps) {
  const {
    mutateAsync: createTask,
    isPending: isCreatingTask,
  } = useCreateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      due_date: "",
    },
  });

  const { showToast } = useToast();

  const onSubmit = async (
    values: NewTaskFormValues,
  ) => {
    try {
      await createTask({
        name: values.name,
        description: values.description,
        due_date: formatDueDateForApi(
          values.due_date,
        ),
        created_by_id: createdById,
        state: "OPEN",
      });

      onCreate();
    } catch (error) {
      console.error(
        "Error creating task:",
        error,
      );
      showToast({
        title: "Error creating task",
        message: "An error occurred while creating the task.",
        type: "error",
        duration: 5000
      });
    }
  };

  return (
    <form
      className="new-task-modal"
      onSubmit={handleSubmit(onSubmit)}
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
            {...register("name")}
          />

          {errors.name && (
            <span className="field__error">
              {errors.name.message}
            </span>
          )}
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
            {...register("description")}
          />

          {errors.description && (
            <span className="field__error">
              {errors.description.message}
            </span>
          )}
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
            {...register("due_date")}
          />

          {errors.due_date && (
            <span className="field__error">
              {errors.due_date.message}
            </span>
          )}
        </div>
      </div>

      <footer className="new-task-modal__footer">
        <button
          type="submit"
          className="button button--primary"
          disabled={isCreatingTask}
        >
          {isCreatingTask
            ? "Creating..."
            : "Create"}
        </button>
      </footer>
    </form>
  );
}

export default NewTaskModal;