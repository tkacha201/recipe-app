import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Recipe from "../components/Recipe";
import "../styles/Home.css";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      // Fetch recipes using the API instance
      const response = await api.get("/api/recipes/");
      setRecipes(response.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.response?.data?.detail || "Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="content">
          <div className="error">Error: {error}</div>
          <button
            className="retry-btn"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchData();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="content">
        <div className="hero-section">
          <div className="hero-content">
            <h2>Share Your Favorite Recipes With the World</h2>
            <p>
              Join our community of food lovers and discover amazing recipes
            </p>
          </div>
        </div>
        <div className="recipes-feed">
          <h2>Popular Recipes</h2>
          {recipes.length === 0 ? (
            <p className="no-recipes">
              No recipes found. Be the first to create one!
            </p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <Recipe key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
