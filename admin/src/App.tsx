import React, { JSX } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Dashboard";
import DriverForm from "./pages/DriverForm";
import RouteForm from "./pages/RouteForm";
import { useAuth } from "./contexts/AuthContext";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<AdminRegister />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/drivers/new"
              element={
                <PrivateRoute>
                  <DriverForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/routes/new"
              element={
                <PrivateRoute>
                  <RouteForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;