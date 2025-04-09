import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateRecipe.css";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [ingredients, setIngredients] = useState([
    { item: "", amount: "", unit: "" },
  ]);
  const [instructions, setInstructions] = useState([{ step: "" }]);
  const [error, setError] = useState("");

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "", amount: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { step: "" }]);
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index].step = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !prepTime || !cookTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (ingredients.some((ing) => !ing.item || !ing.amount || !ing.unit)) {
      setError("Please fill in all ingredient fields");
      return;
    }

    if (instructions.some((inst) => !inst.step)) {
      setError("Please fill in all instruction steps");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/recipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          prep_time: prepTime,
          cook_time: cookTime,
          image_url: imageUrl,
          tags: JSON.stringify(tags),
          ingredients: JSON.stringify(ingredients),
          instructions: JSON.stringify(instructions.map((inst) => inst.step)),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("Failed to create recipe. Please try again.");
    }
  };

  return (
    <div className="create-recipe-container">
      <div className="create-recipe-form">
        <h2>Create New Recipe</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter recipe title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter recipe description"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Preparation Time (minutes) *</label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="Enter prep time"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cookTime">Cooking Time (minutes) *</label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="Enter cook time"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                />
                <button type="button" onClick={handleAddTag}>
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  value={ingredient.item}
                  onChange={(e) =>
                    handleIngredientChange(index, "item", e.target.value)
                  }
                  placeholder="Ingredient"
                  required
                />
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  placeholder="Amount"
                  required
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  placeholder="Unit"
                  required
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
            <button type="button" onClick={handleAddIngredient}>
              Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions *</label>
            {instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <span className="step-number">{index + 1}.</span>
                <textarea
                  value={instruction.step}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveInstruction(index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddInstruction}>
              Add Instruction
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
