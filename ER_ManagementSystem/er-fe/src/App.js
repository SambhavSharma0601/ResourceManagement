import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // Sample private page
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerStatsPage from "./pages/ManagerStatsPage";

function App() {
  const isAuthenticated = localStorage.getItem("token"); // you can use context later

  return (
    <Router>
      <Routes>
        {/* Default route always redirects to /login if not authenticated */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-stats"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ManagerStatsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
