import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
