import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setIsCheckingAuth(false); // Auth check is complete
  }, []);

  const PrivateRoute = ({ children }) => {
    if (isCheckingAuth) return null; // Show a loader or null until auth check completes
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (isCheckingAuth) return null; // Show a loader or null until auth check completes
    return user ? <Navigate to="/dashboard" /> : children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup setUser={setUser} /></PublicRoute>} />
        <Route path="/oauth2callback" element={<OAuthCallback setUser={setUser} />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Dynamic Dashboard Route */}
        <Route 
          path="/dashboard/:title/:videoNumber" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} 
        />

        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}


export default App;