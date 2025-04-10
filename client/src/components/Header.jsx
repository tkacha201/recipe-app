import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      if (!isAuthenticated) {
        setUsername("");
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers: { "x-auth-token": token } }
        );

        if (response.data?.name) {
          setUsername(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [isAuthenticated, token, location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setUsername("");
    navigate("/login");
  }

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-teal-500">TastyHub</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated && username && (
            <span className="text-gray-700 font-medium">Hi, {username}</span>
          )}

          <Link
            to="/"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            Home
          </Link>

          <Link
            to="/recipes"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            Recipes
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-recipe"
                className="text-gray-700 hover:text-teal-500 font-medium"
              >
                Create Recipe
              </Link>

              <Link
                to="/profile"
                className="text-gray-700 hover:text-teal-500 font-medium"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
