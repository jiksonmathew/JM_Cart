import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RestrictAdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const { adminMode } = useSelector((state) => state.adminMode);

  if (user?.role === "admin" && adminMode) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default RestrictAdminRoute;
