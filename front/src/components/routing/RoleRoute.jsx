import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getRoleHomePath, normalizeRoleKey } from "../../utils/roleRoutes.js";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  const roleKey = normalizeRoleKey(user.role);

  if (!allowedRoles.includes(roleKey)) {
    return <Navigate to={getRoleHomePath(roleKey)} replace />;
  }

  return children;
};

export default RoleRoute;
