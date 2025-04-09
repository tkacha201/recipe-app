import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Recipe.css";

function Recipe({ recipe }) {
  const navigate = useNavigate();
  const totalTime = recipe.prep_time + recipe.cook_time;

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <div className="recipe-image">
        <img src={recipe.image_url} alt={recipe.title} />
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span className="recipe-author">By {recipe.author_username}</span>
          <span className="recipe-time">{totalTime} min</span>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
