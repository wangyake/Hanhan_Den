import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;