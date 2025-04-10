import { Navigate, useLocation } from "react-router-dom";
import { showError } from "./Toast";

function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    showError("Please login to access this page");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default PrivateRoute;
