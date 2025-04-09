import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        // Store tokens
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("token", res.data.access); // For backward compatibility

        // Get user ID from the token
        const token = res.data.access;
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("user_id", tokenPayload.user_id);

        // Redirect to home page
        navigate("/", { replace: true });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit" disabled={loading}>
        {name}
      </button>
    </form>
  );
}

export default Form;
