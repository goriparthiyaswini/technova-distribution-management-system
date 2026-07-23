import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}