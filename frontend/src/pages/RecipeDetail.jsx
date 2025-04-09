import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";
import "../styles/RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.user_id;

    // Fetch recipe details
    api
      .get(`/api/recipes/${id}/`)
      .then((response) => {
        setRecipe(response.data);
        setEditedRecipe(response.data);
        setIsAuthor(response.data.author === userId);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe details");
        setLoading(false);
      });
  }, [id, navigate]);

  const handleUpdate = () => {
    api
      .put(`/api/recipes/update/${id}/`, editedRecipe)
      .then((response) => {
        setRecipe(response.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating recipe:", err);
        alert("Failed to update recipe");
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      api
        .delete(`/api/recipes/delete/${id}/`)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("Error deleting recipe:", err);
          alert("Failed to delete recipe");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setEditedRecipe((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setEditedRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...editedRecipe.instructions];
    newInstructions[index] = value;
    setEditedRecipe((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="recipe-detail-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Recipes
      </button>

      {isEditing ? (
        <div className="edit-form">
          <h2>Edit Recipe</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editedRecipe.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editedRecipe.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                type="number"
                name="prep_time"
                value={editedRecipe.prep_time}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Cook Time (minutes)</label>
              <input
                type="number"
                name="cook_time"
                value={editedRecipe.cook_time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={editedRecipe.image_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={editedRecipe.tags.join(", ")}
              onChange={handleTagChange}
            />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            {editedRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Instructions</label>
            {editedRecipe.instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <span className="step-number">{index + 1}</span>
                <textarea
                  value={instruction}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="button-group">
            <button className="save-button" onClick={handleUpdate}>
              Save Changes
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="recipe-detail">
          <div className="recipe-header">
            <h1>{recipe.title}</h1>
            <div className="recipe-meta">
              <span className="author">By {recipe.author_username}</span>
              <span className="time">
                Total Time: {recipe.prep_time + recipe.cook_time} minutes
              </span>
            </div>
          </div>

          <div className="recipe-image">
            <img src={recipe.image_url} alt={recipe.title} />
          </div>

          <div className="recipe-content">
            <p className="description">{recipe.description}</p>

            <div className="recipe-tags">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="recipe-times">
              <div className="time-item">
                <span className="label">Prep Time</span>
                <span className="value">{recipe.prep_time} minutes</span>
              </div>
              <div className="time-item">
                <span className="label">Cook Time</span>
                <span className="value">{recipe.cook_time} minutes</span>
              </div>
            </div>

            <div className="ingredients-section">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.amount} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h2>Instructions</h2>
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          {isAuthor && (
            <div className="author-actions">
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Recipe
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Delete Recipe
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
