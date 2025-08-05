import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/pages/Register';
import Login from '../src/pages/Login';
import Dashboard from '../src/pages/UserDashboard';
import NutriDashboard from './pages/NutriDashboard';

//  Check if token is valid
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');

  if (!token || !expiresAt) return false;
  return Date.now() < parseInt(expiresAt);
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
};

function App() {
  //  Auto logout when token expires
  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      const timeout = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        window.location.href = '/login';
      }, parseInt(expiresAt) - Date.now());

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Regular User Dashboard */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Nutritionist Dashboard */}
        <Route
          path="/nutridashboard"
          element={
            <ProtectedRoute>
              <NutriDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default: Redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
