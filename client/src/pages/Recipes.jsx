import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/recipes/all"
        );
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.key]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-2 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">All Recipes</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No recipes found</p>
          <Link
            to="/create-recipe"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/recipe/${recipe._id}`}>
                <div className="relative">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded-full flex items-center">
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
                    <span className="text-xs font-medium">
                      {recipe.likes ? recipe.likes.length : 0}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/recipe/${recipe._id}`}>
                  <h2 className="text-xl font-bold mb-2 hover:text-teal-500 transition-colors">
                    {recipe.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">
                  {recipe.ingredients.length} ingredients
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    By {recipe.createdBy?.name || "Unknown"}
                  </span>
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="text-teal-500 hover:text-teal-600 font-medium"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
