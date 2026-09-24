import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useModal } from "../../components/modal/useModal";
import NewTaskModal from "../../components/newtaskmodal/NewTaskModal";
import TaskDetailModal from "../../components/taskdetailmodal/TaskDetailModal";
import { useToast } from "../../components/toast/useToast";
import { useAuth } from "../../hooks/use-auth";
import { useTasks } from "../../hooks/use-tasks";
import { appRoutes } from "../../routes/appRoutes";

import { useAccounts } from "../../hooks/use-accounts";
import { useAssignTask } from "../../hooks/use-assign-task";
import { useTaskStates } from "../../hooks/use-task-states";
import { useUpdateTaskState } from "../../hooks/use-update-task-state";

import "./TaskDashboard.css";
import { useDeleteTask } from "../../hooks/use-delete-task";

const PAGE_SIZE = 10;

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}


function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M9 12h9" />
    </svg>
  );
}


function TaskDashboard() {
  const navigate = useNavigate();

  const [namePrefix, setNamePrefix] = useState("");
  const [state, setState] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [page, setPage] = useState(1);

  const {
    closeModal,
    openModal,
    successModal,
  } = useModal();

  const {
    data: account,
    logout,
  } = useAuth();

  const {
    data: accounts = [],
  } = useAccounts();

  const {
    data: taskStates = [],
  } = useTaskStates();

  const {
    mutateAsync: updateTaskState,
    isPending: isUpdatingState,
  } = useUpdateTaskState();

  const {
    mutateAsync: deleteTaskMutation,
    isPending: isDeletingTask,
  } = useDeleteTask();

  const {
    mutateAsync: assignTask,
    isPending: isAssigningTask,
  } = useAssignTask();

  const { showToast } = useToast();

  const {
    data: tasksResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTasks({
    name_prefix:
      namePrefix.trim() !== ""
        ? namePrefix
        : undefined,

    state:
      state !== ""
        ? state
        : undefined,

    due_date:
      dueDate !== ""
        ? dueDate
        : undefined,

    page,
    page_size: PAGE_SIZE,
  });

  const tasks = tasksResponse?.data ?? [];
  const meta = tasksResponse?.meta;

  const totalPages = Math.max(
    1,
    Math.ceil(
      (meta?.total ?? 0) /
        (meta?.page_size ?? PAGE_SIZE),
    ),
  );

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTaskMutation({
        taskId,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  async function handleStateChange(
    taskId: number,
    state: string,
  ) {
    if (account === null) {
      return;
    }

    try {
      await updateTaskState({
        taskId,
        state,
        updated_by_id: account.account_id,
      });

      showToast({
        title: "State updated",
        message: "The task state was updated successfully.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      showToast({
        title: "Unable to update state",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update task state.",
        type: "error",
        duration: 5000,
      });
    }
  }

  async function handleAssignChange(
    taskId: number,
    assignedToId: number,
  ) {
    if (account === null) {
      return;
    }

    try {
      await assignTask({
        taskId,
        assigned_to_id: assignedToId,
        updated_by_id: account.account_id,
      });

      showToast({
        title: "Task assigned",
        message: "The task was assigned successfully.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      showToast({
        title: "Unable to assign task",
        message:
          error instanceof Error
            ? error.message
            : "Unable to assign the task.",
        type: "error",
        duration: 5000,
      });
    }
  }

  function handleOpenNewTask() {
    openModal({
      width: "520px",
      height: "auto",

      content: (
        <NewTaskModal
          createdById={account!.account_id}
          onClose={closeModal}
          onCreate={() => {
            successModal();
          }}
        />
      ),

      onSuccess: () => {
        void refetch();

        showToast({
          title: "Task Pending to be created",
          message:
            "The task was created successfully.",
          type: "info",
          duration: 5000,
        });
      },
    });
  }


  function handleOpenTaskDetail(
    task: (typeof tasks)[number],
  ) {
    openModal({
      width: "520px",
      height: "auto",

      content: (
        <TaskDetailModal
          task={task}
          onClose={closeModal}
          updatedById={account!.account_id}
          onUpdate={() => {
            successModal();
          }}
        />
      ),

      onSuccess: () => {
        void refetch();

        showToast({
          title: "Task updated",
          message: `Task #${task.id} was updated.`,
          type: "success",
        });
      },
    });
  }


  function handleLogout() {
    logout();

    navigate(appRoutes.login, {
      replace: true,
    });
  }

  return (
    <main className="task-dashboard">
      <header className="task-dashboard__header">
        <div className="task-dashboard__header-left">
          <Link
            className="task-dashboard__logo"
            to={appRoutes.home}
            aria-label="Back to home"
          >
            WB
          </Link>

          <button
            type="button"
            className="button button--primary"
            onClick={handleOpenNewTask}
          >
            + New Task
          </button>
        </div>

        <div className="task-dashboard__user">
          <div className="task-dashboard__avatar">
            {account?.name?.charAt(0) ?? ""}
            {account?.last_name?.charAt(0) ?? ""}
          </div>

          <span className="task-dashboard__username">
            {account?.name} {account?.last_name}
          </span>

          <button
            type="button"
            className="task-dashboard__logout"
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </button>
        </div>
      </header>

      <div className="task-dashboard__content">
        <section className="task-filters">
          <div className="field">
            <label
              className="field__label"
              htmlFor="task-name"
            >
              Task name
            </label>

            <input
              id="task-name"
              className="input"
              type="text"
              placeholder="Search tasks..."
              value={namePrefix}
              onChange={(event) => {
                setNamePrefix(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="field">
            <label
              className="field__label"
              htmlFor="task-state"
            >
              State
            </label>

            <select
              id="task-state"
              className="input"
              value={state}
              onChange={(event) => {
                setState(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="PROGRESS">
                Progress
              </option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="field">
            <label
              className="field__label"
              htmlFor="due-date"
            >
              Due date
            </label>

            <input
              id="due-date"
              className="input"
              type="date"
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </section>

        <section className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th aria-label="Actions" />
                <th>Name</th>
                <th>State</th>
                <th>Assigned to</th>
                <th>Created by</th>
                <th>Created at</th>
                <th>Due date</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && isDeletingTask && (
                <tr>
                  <td colSpan={8}>
                    Loading tasks...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={8}>
                    Unable to load tasks.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                tasks.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      No tasks found.
                    </td>
                  </tr>
                )}

              {!isLoading &&
                !isDeletingTask &&
                !isError &&
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <button
                        type="button"
                        className="task-table__delete"
                        aria-label={`Delete ${task.name}`}
                        onClick={() => void handleDeleteTask(task.id)}
                      >
                        <TrashIcon />
                      </button>
                    </td>

                    <td className="task-table__name-column">
                      <button
                        type="button"
                        className="task-table__name-button"
                        onClick={() => {
                          handleOpenTaskDetail(task);
                        }}
                      >
                        {task.name}
                      </button>
                    </td>

                    <td>
                      <select
                        className="task-table__select"
                        value={task.state}
                        disabled={isUpdatingState}
                        onChange={(event) => {
                          void handleStateChange(
                            task.id,
                            event.target.value,
                          );
                        }}
                      >
                        {taskStates.map((taskState) => (
                          <option
                            key={taskState.id}
                            value={taskState.name}
                          >
                            {taskState.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="task-table__user-column">
                      <select
                        className="task-table__select"
                        value={task.assigned_to?.id ?? ""}
                        disabled={isAssigningTask}
                        onChange={(event) => {
                          const assignedToId = Number(event.target.value);

                          if (!assignedToId) {
                            return;
                          }

                          void handleAssignChange(task.id, assignedToId);
                        }}
                      >
                        <option value="" disabled>
                          Unassigned
                        </option>

                        {accounts.map((item) => (
                          <option
                            key={item.account_id}
                            value={item.account_id}
                          >
                            {item.name} {item.last_name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="task-table__user-column">
                      {task.created_by.name}
                    </td>

                    <td>
                      {new Date(
                        task.created_at,
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        task.due_date,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        <div className="task-dashboard__refresh-status">
          {isFetching
            ? "Refreshing..."
            : "Updated"}
        </div>        
        <footer className="task-pagination">
          <button
            type="button"
            className="button button--subtle"
            disabled={
              isLoading ||
              page <= 1
            }
            onClick={() => {
              setPage((current) =>
                Math.max(1, current - 1),
              );
            }}
          >
            Previous
          </button>

          <span className="task-pagination__page">
            Page {meta?.page ?? page} of{" "}
            {totalPages}
          </span>

          <button
            type="button"
            className="button button--subtle"
            disabled={
              isLoading ||
              page >= totalPages
            }
            onClick={() => {
              setPage((current) =>
                Math.min(
                  totalPages,
                  current + 1,
                ),
              );
            }}
          >
            Next
          </button>
        </footer>
      </div>
    </main>
  );
}


export default TaskDashboard;