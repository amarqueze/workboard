import { useToast } from "../../components/toast/useToast";
import "./TaskDashboard.css";

  
type Task = {
  id: number;
  name: string;
  description: string;
  state: string;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  due_date: string;
};

const mockTasks: Task[] = [
  {
    id: 1,
    name: "Review quarterly report",
    description: "Review financial results and disclosure notes.",
    state: "OPEN",
    assigned_to: "Rodrigo Díaz",
    created_by: "Rodrigo Díaz de Vivar",
    created_at: "2026-09-20T14:30:00Z",
    due_date: "2026-10-10T00:00:00Z",
  },
  {
    id: 2,
    name: "Prepare revenue disclosure",
    description: "Prepare revenue disclosure information.",
    state: "PROGRESS",
    assigned_to: null,
    created_by: "Rodrigo Díaz de Vivar",
    created_at: "2026-09-21T09:15:00Z",
    due_date: "2026-10-15T00:00:00Z",
  },
  {
    id: 3,
    name: "Validate cash flow disclosure",
    description: "Validate cash flow disclosure balances.",
    state: "REVIEW",
    assigned_to: "Alfonso VI",
    created_by: "Rodrigo Díaz de Vivar",
    created_at: "2026-09-22T11:45:00Z",
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
  const { showToast } = useToast();
  function handleToast() {
    showToast({
      title: "Welcome back",
      message: "You have signed in successfully.",
      type: "success",
    });
  }

  return (
    <main className="task-dashboard">
      <header className="task-dashboard__header">
        <div className="task-dashboard__header-left">
          <div className="task-dashboard__logo">WB</div>

          <button
            type="button"
            className="button button--primary"
            onClick={handleToast}
          >
            + New Task
          </button>
        </div>

        <div className="task-dashboard__user">
          <div className="task-dashboard__avatar">
            RD
          </div>

          <span className="task-dashboard__username">
            Rodrigo Díaz de Vivar
          </span>

          <button
            type="button"
            className="task-dashboard__logout"
            aria-label="Sign out"
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
              {mockTasks.map((task) => (
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

                  <td className="task-table__name">
                    {task.name}
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