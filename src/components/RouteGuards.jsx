import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Logged-out visitors are sent to /login and returned to where they were going afterwards.
export function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Logged-in users don't need the login/register screens.
export function PublicOnlyRoute({ children, redirectTo = "/dashboard" }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
}
