import { useAuthUser } from '@/api/AuthProvider';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

const AuthTemplate: React.FC = () => {
  const { user, loading } = useAuthUser();

  return loading ? (
    <div>Loading</div>
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthTemplate;
