import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Recipe from "../components/Recipe";
import "../styles/Home.css";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;

        // Fetch user details
        const userResponse = await fetch(
          `http://localhost:8000/api/user/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userResponse.json();
        setUsername(userData.username);

        // Fetch recipes
        const recipesResponse = await fetch(
          "http://localhost:8000/api/recipes/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!recipesResponse.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const recipesData = await recipesResponse.json();
        setRecipes(recipesData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />
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
}

export default Home;
