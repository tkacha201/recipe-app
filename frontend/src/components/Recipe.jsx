import React, { useState } from "react";
import "../styles/Recipe.css";

function Recipe({ recipe, onDelete, onUpdate }) {
  const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-GB");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recipe.title);
  const [editedDescription, setEditedDescription] = useState(
    recipe.description
  );
  const [editedPrepTime, setEditedPrepTime] = useState(recipe.prep_time);
  const [editedCookTime, setEditedCookTime] = useState(recipe.cook_time);
  const [editedImageUrl, setEditedImageUrl] = useState(recipe.image_url);
  const [editedTags, setEditedTags] = useState(recipe.tags);
  const [tagInput, setTagInput] = useState("");
  const [editedIngredients, setEditedIngredients] = useState(
    recipe.ingredients
  );
  const [editedInstructions, setEditedInstructions] = useState(
    recipe.instructions
  );

  // Get the current user's ID from localStorage
  const currentUserId = localStorage.getItem("user_id");
  // Check if the current user is the author of the recipe
  const isAuthor = recipe.author === parseInt(currentUserId);

  const handleUpdate = () => {
    onUpdate(recipe.id, {
      title: editedTitle,
      description: editedDescription,
      prep_time: editedPrepTime,
      cook_time: editedCookTime,
      image_url: editedImageUrl,
      tags: editedTags,
      ingredients: editedIngredients,
      instructions: editedInstructions,
    });
    setIsEditing(false);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...editedTags];
    newTags.splice(index, 1);
    setEditedTags(newTags);
  };

  const handleAddIngredient = () => {
    setEditedIngredients([...editedIngredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...editedIngredients];
    newIngredients.splice(index, 1);
    setEditedIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...editedIngredients];
    newIngredients[index][field] = value;
    setEditedIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setEditedInstructions([...editedInstructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...editedInstructions];
    newInstructions.splice(index, 1);
    setEditedInstructions(newInstructions);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...editedInstructions];
    newInstructions[index] = value;
    setEditedInstructions(newInstructions);
  };

  return (
    <div className="recipe-container">
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor="recipeTitle">Recipe Title</label>
            <input
              type="text"
              id="recipeTitle"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-input"
              placeholder="Recipe Title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipeDescription">Description</label>
            <textarea
              id="recipeDescription"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-textarea"
              placeholder="Description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (minutes)</label>
              <input
                type="number"
                id="prepTime"
                value={editedPrepTime}
                onChange={(e) => setEditedPrepTime(parseInt(e.target.value))}
                className="edit-input"
                placeholder="Prep Time (minutes)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cookTime">Cook Time (minutes)</label>
              <input
                type="number"
                id="cookTime"
                value={editedCookTime}
                onChange={(e) => setEditedCookTime(parseInt(e.target.value))}
                className="edit-input"
                placeholder="Cook Time (minutes)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipeImage">Image URL</label>
            <input
              type="url"
              id="recipeImage"
              value={editedImageUrl}
              onChange={(e) => setEditedImageUrl(e.target.value)}
              className="edit-input"
              placeholder="Image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipeTags">Tags</label>
            <div className="tags-input">
              <input
                type="text"
                id="recipeTags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                placeholder="Add a tag and press Enter"
              />
              <div className="tags-container">
                {editedTags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={() => handleRemoveTag(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            <div id="ingredientsList">
              {editedIngredients.map((ingredient, index) => (
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
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-btn"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <div id="instructionsList">
              {editedInstructions.map((instruction, index) => (
                <div key={index} className="instruction-row">
                  <span className="step-number">{index + 1}</span>
                  <textarea
                    placeholder="Instruction step"
                    value={instruction}
                    onChange={(e) =>
                      handleInstructionChange(index, e.target.value)
                    }
                  ></textarea>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveInstruction(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-btn"
              onClick={handleAddInstruction}
            >
              Add Step
            </button>
          </div>

          <div className="button-group">
            <button className="save-button" onClick={handleUpdate}>
              Save
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
        <>
          <div className="recipe-header">
            <h2 className="recipe-title">{recipe.title}</h2>
            <div className="recipe-meta">
              <p className="recipe-author">
                By: {recipe.author_username || "Unknown"}
              </p>
              <p className="recipe-date">{formattedDate}</p>
            </div>
          </div>

          <div className="recipe-image">
            <img src={recipe.image_url} alt={recipe.title} />
          </div>

          <div className="recipe-details">
            <div className="recipe-times">
              <span>Prep: {recipe.prep_time} min</span>
              <span>Cook: {recipe.cook_time} min</span>
              <span>Total: {recipe.prep_time + recipe.cook_time} min</span>
            </div>

            <div className="recipe-tags">
              {recipe.tags &&
                recipe.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
            </div>

            <p className="recipe-description">{recipe.description}</p>

            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients &&
                  recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.amount} {ingredient.name}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="recipe-instructions">
              <h3>Instructions</h3>
              <ol>
                {recipe.instructions &&
                  recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
              </ol>
            </div>
          </div>

          {isAuthor && (
            <div className="button-group">
              <button
                className="update-button"
                onClick={() => setIsEditing(true)}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => onDelete(recipe.id)}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Recipe;
