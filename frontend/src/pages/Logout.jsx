import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
  }, [navigate]);

  return null;
}

export default Logout;
