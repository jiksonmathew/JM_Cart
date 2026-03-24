import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { adminMode } = useSelector((state) => state.adminMode);

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (user?.role !== "admin") return <Navigate to="/" />;

  if (!adminMode) return <Navigate to="/" />;

  return children;
}
