import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./TaskDetailModal.css";

import type { TaskItem } from "../../app.types";
import { useUpdateTask } from "../../hooks/use-update-task";
import { useToast } from "../toast/useToast";

const taskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(150, "Name is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskDetailModalProps = {
  task: TaskItem;
  updatedById: number;
  onUpdate: () => void;
  onClose: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatDueDateForApi(value: string) {
  return value.slice(0, 10);
}

function TaskDetailModal({
  task,
  updatedById,
  onUpdate,
  onClose,
}: TaskDetailModalProps) {
  const {
    mutateAsync: updateTask,
    isPending: isUpdatingTask,
  } = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      description: task.description,
    },
  });

  const { showToast } = useToast();

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await updateTask({
        taskId: task.id,
        name: values.name,
        description: values.description,
        due_date: formatDueDateForApi(task.due_date),
        updated_by_id: updatedById,
      });

      onUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
      showToast({
        title: "Update failed",
        message: "There was an error updating the task.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <form
      className="task-detail-modal"
      onSubmit={handleSubmit(onSubmit)}
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
            htmlFor={`task-detail-description-${task.id}`}
          >
            Description
          </label>

          <textarea
            id={`task-detail-description-${task.id}`}
            className="textarea task-detail-modal__description"
            {...register("description")}
          />

          {errors.description && (
            <span className="field__error">
              {errors.description.message}
            </span>
          )}
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
          disabled={isUpdatingTask}
        >
          {isUpdatingTask ? "Updating..." : "Update"}
        </button>
      </footer>
    </form>
  );
}

export default TaskDetailModal;