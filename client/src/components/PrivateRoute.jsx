import { Navigate, useLocation } from "react-router-dom";
import { showError } from "./Toast";

function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Skip showing the toast notification when coming from "Share a Recipe" button in homepage
    const isFromHomeShare =
      location.pathname === "/create-recipe" ||
      location.state?.fromHomeShare === true;

    if (!isFromHomeShare) {
      showError("Please login to access this page");
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default PrivateRoute;
