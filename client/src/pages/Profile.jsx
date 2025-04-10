import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipesError, setRecipesError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        console.log("Profile data:", response.data);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/recipes/my-recipes",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        setUserRecipes(response.data);
        setRecipesLoading(false);
      } catch (err) {
        console.error("Error fetching user recipes:", err);
        setRecipesError("Failed to load your recipes. Please try again later.");
        setRecipesLoading(false);
      }
    };

    fetchUserRecipes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-8">User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Name</h2>
          <p className="text-gray-700">{user.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-gray-700">{user.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Account Created</h2>
          <p className="text-gray-700">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-6 flex space-x-4">
          <Link
            to="/update-profile"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User's Recipes Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-6">My Recipes</h2>

        {recipesLoading ? (
          <div className="text-center py-4">Loading your recipes...</div>
        ) : recipesError ? (
          <div className="text-center py-4 text-red-500">{recipesError}</div>
        ) : userRecipes.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">
              You haven't created any recipes yet.
            </p>
            <Link
              to="/create-recipe"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
            >
              Create Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-gray-50 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/recipe/${recipe._id}`}>
                  <div className="h-40 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 hover:text-teal-500 transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {recipe.ingredients.length} ingredients
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {recipe.likes ? recipe.likes.length : 0}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex space-x-2">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
