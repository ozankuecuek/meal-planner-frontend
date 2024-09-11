import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; // Import the Firebase auth instance

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>; // Show loading state while checking auth

  return user ? children : <Navigate to="/login" />; // If no user, redirect to login
};

export default ProtectedRoute;
