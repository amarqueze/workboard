import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import TaskDashboard from "../pages/taskdashboard/TaskDashboard";
import { appRoutes } from "./appRoutes";
import ProtectedRoute from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={appRoutes.login}
        element={<LoginPage />}
      />

      <Route
        element={<ProtectedRoute />}
      >
        <Route
          path="/"
          element={
            <Navigate
              to={appRoutes.home}
              replace
            />
          }
        />

        <Route
          path={appRoutes.home}
          element={<HomePage />}
        />

        <Route
          path={appRoutes.taskDashboard}
          element={<TaskDashboard />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={appRoutes.login}
            replace
          />
        }
      />
    </Routes>
  );
}
