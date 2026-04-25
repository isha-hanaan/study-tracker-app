import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WeeklyPlannerPage from './pages/WeeklyPlannerPage';
import ProgressReportPage from './pages/ProgressReportPage';

import './styles/app.css';

function AppRoutes() {
  const { user, authChecked } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <WeeklyPlannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressReportPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function Navigation() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="nav-links">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/planner">Planner</Link>
      <Link to="/progress">Progress</Link>

      <button onClick={logout} className="btn-logout">
        Logout
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudyProvider>
          <div className="app">
            <nav className="navbar">
              <div className="nav-container">
                <h2 className="nav-brand">📚 Study Tracker</h2>
                <Navigation />
              </div>
            </nav>

            <main className="app-main">
              <AppRoutes />
            </main>
          </div>
        </StudyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}