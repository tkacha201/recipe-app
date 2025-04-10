import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function Home() {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/recipes/all"
        );

        const sortedRecipes = [...response.data].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );

        setPopularRecipes(sortedRecipes.slice(0, 4));
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [location.key]);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-gray-800 py-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Share Your Favorite Recipes
            <br />
            With the World
          </h1>
          <p className="text-xl text-white mb-8">
            Join our community of food lovers and discover amazing recipes
          </p>
          <Link
            to="/create-recipe"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-md text-lg transition-colors"
          >
            Share a Recipe
          </Link>
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Recipes
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading recipes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {popularRecipes.length > 0 ? (
              popularRecipes.map((recipe) => (
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
                          {recipe.likes?.length || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/recipe/${recipe._id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-teal-500 transition-colors">
                        {recipe.title}
                      </h3>
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
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-4">
                No recipes found. Be the first to add one!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
