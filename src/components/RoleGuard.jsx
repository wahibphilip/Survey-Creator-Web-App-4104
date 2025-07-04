import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ children, requiredPermission, requiredRole, fallback = null }) => {
  const { hasPermission, hasRole } = useAuth();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;