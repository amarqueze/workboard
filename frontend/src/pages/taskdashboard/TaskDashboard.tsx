import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useModal } from "../../components/modal/useModal";
import NewTaskModal from "../../components/newtaskmodal/NewTaskModal";
import TaskDetailModal from "../../components/taskdetailmodal/TaskDetailModal";
import { useToast } from "../../components/toast/useToast";
import { appRoutes } from "../../routes/appRoutes";
import "./TaskDashboard.css";

type Task = {
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

const mockTasks: Task[] = [
  {
    id: 1,
    name: "Review quarterly report",
    description: "Review financial results and disclosure notes.",
    state: "OPEN",
    assigned_to: "Rodrigo Diaz",
    created_by: "Rodrigo Diaz de Vivar",
    updated_by: "Rodrigo Diaz de Vivar",
    created_at: "2026-09-20T14:30:00Z",
    updated_at: "2026-09-21T16:20:00Z",
    due_date: "2026-10-10T00:00:00Z",
  },
  {
    id: 2,
    name: "Prepare revenue disclosure",
    description: "Prepare revenue disclosure information.",
    state: "PROGRESS",
    assigned_to: null,
    created_by: "Rodrigo Diaz de Vivar",
    updated_by: "Alfonso VI",
    created_at: "2026-09-21T09:15:00Z",
    updated_at: "2026-09-22T10:40:00Z",
    due_date: "2026-10-15T00:00:00Z",
  },
  {
    id: 3,
    name: "Validate cash flow disclosure",
    description: "Validate cash flow disclosure balances.",
    state: "REVIEW",
    assigned_to: "Alfonso VI",
    created_by: "Rodrigo Diaz de Vivar",
    updated_by: "Alfonso VI",
    created_at: "2026-09-22T11:45:00Z",
    updated_at: "2026-09-23T08:10:00Z",
    due_date: "2026-10-20T00:00:00Z",
  },
];

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
  const [tasks, setTasks] = useState(mockTasks);
  const {
    closeModal,
    openModal,
    successModal,
  } = useModal();
  const { showToast } = useToast();

  function handleOpenNewTask() {
    openModal({
      width: "520px",
      height: "auto",
      content: (
        <NewTaskModal
          onClose={closeModal}
          onCreate={(values) => {
            const now = new Date().toISOString();

            setTasks((currentTasks) => {
              const nextTaskId =
                currentTasks.reduce(
                  (currentMaxId, task) =>
                    Math.max(currentMaxId, task.id),
                  0,
                ) + 1;

              return [
                ...currentTasks,
                {
                  id: nextTaskId,
                  name: values.name,
                  description: values.description,
                  state: "OPEN",
                  assigned_to: null,
                  created_by: "Rodrigo Diaz de Vivar",
                  updated_by: "Rodrigo Diaz de Vivar",
                  created_at: now,
                  updated_at: now,
                  due_date: `${values.due_date}T00:00:00Z`,
                },
              ];
            });

            successModal();
          }}
        />
      ),
      onSuccess: () => {
        showToast({
          title: "Task created",
          message: "The task was created successfully.",
          type: "success",
        });
      },
    });
  }

  function handleOpenTaskDetail(task: Task) {
    openModal({
      width: "520px",
      height: "auto",
      content: (
        <TaskDetailModal
          task={task}
          onClose={closeModal}
          onUpdate={(values) => {
            setTasks((currentTasks) =>
              currentTasks.map((currentTask) =>
                currentTask.id === values.id
                  ? {
                      ...currentTask,
                      name: values.name,
                      description: values.description,
                      updated_at: new Date().toISOString(),
                    }
                  : currentTask,
              ),
            );
            successModal();
          }}
        />
      ),
      onSuccess: () => {
        showToast({
          title: "Task updated",
          message: `Task #${task.id} was updated.`,
          type: "success",
        });
      },
    });
  }

  function handleLogout() {
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
            RD
          </div>

          <span className="task-dashboard__username">
            Rodrigo Diaz de Vivar
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
              defaultValue=""
            >
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="PROGRESS">Progress</option>
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
            />
          </div>
        </section>

        <section className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th aria-label="Actions" />
                <th>Name</th>
                <th>Description</th>
                <th>State</th>
                <th>Assigned to</th>
                <th>Created by</th>
                <th>Created at</th>
                <th>Due date</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <button
                      type="button"
                      className="task-table__delete"
                      aria-label={`Delete ${task.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </td>

                  <td>
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

                  <td>{task.description}</td>

                  <td>
                    <span className="task-state">
                      {task.state}
                    </span>
                  </td>

                  <td>
                    {task.assigned_to ?? "Unassigned"}
                  </td>

                  <td>{task.created_by}</td>

                  <td>
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="task-pagination">
          <button
            type="button"
            className="button button--subtle"
          >
            Previous
          </button>

          <span className="task-pagination__page">
            Page 1
          </span>

          <button
            type="button"
            className="button button--subtle"
          >
            Next
          </button>
        </footer>
      </div>
    </main>
  );
}

export default TaskDashboard;
