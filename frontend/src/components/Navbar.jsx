import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.user_id;
          setUsername(decoded.username);

          const response = await fetch(
            `http://localhost:8000/api/user/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setDisplayName(data.profile?.display_name || "");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    // Remove all tokens
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // Use display name if available, otherwise use username
  const greetingName = displayName || username;

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        <svg className="chef-hat-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.5 2 7.5 3.5 7 5.5C7 5.5 7 5.5 7 5.5C5.5 5.5 4 6.5 4 8C4 9.5 5 10.5 6.5 10.5C6.5 10.5 6.5 10.5 6.5 10.5C6.5 12.5 7.5 14 9 14.5V19H15V14.5C16.5 14 17.5 12.5 17.5 10.5C17.5 10.5 17.5 10.5 17.5 10.5C19 10.5 20 9.5 20 8C20 6.5 18.5 5.5 17 5.5C17 5.5 17 5.5 17 5.5C16.5 3.5 14.5 2 12 2Z" />
        </svg>
        <span className="brand-text">TastyHub</span>
      </div>
      <div className="nav-buttons">
        <span className="user-greeting">Hello, {greetingName}</span>
        <button className="nav-btn home-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button
          className="nav-btn create-btn"
          onClick={() => navigate("/create-recipe")}
        >
          Create Recipe
        </button>
        <button className="nav-btn profile-btn" onClick={handleProfile}>
          Profile
        </button>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
