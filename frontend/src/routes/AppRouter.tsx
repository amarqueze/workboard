import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import TaskDashboard from "../pages/taskdashboard/TaskDashboard";
import { appRoutes } from "./appRoutes";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={appRoutes.login}
        element={<LoginPage />}
      />

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
