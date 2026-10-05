import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth, Role } from "@/hooks/useAuth";

const ProtectedRoute = ({ role, children }: { role: Role; children: ReactNode }) => {
  const { session, roles, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Verifying session…</div>;
  if (!session) return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
export default ProtectedRoute;
