import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/CreateRecipe.css";

function CreateRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState([""]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setEditedInstructions(newInstructions);
  };

  const createRecipe = (e) => {
    e.preventDefault();

    // Validate ingredients and instructions
    const validIngredients = ingredients.filter(
      (ing) => ing.name && ing.amount
    );
    const validInstructions = instructions.filter((inst) => inst.trim());

    if (validIngredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    if (validInstructions.length === 0) {
      alert("Please add at least one instruction");
      return;
    }

    api
      .post("/api/recipes/", {
        title,
        description,
        prep_time: parseInt(prepTime),
        cook_time: parseInt(cookTime),
        image_url: imageUrl,
        tags,
        ingredients: validIngredients,
        instructions: validInstructions,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Recipe created!");
          navigate("/");
        } else {
          alert("Failed to create recipe.");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="create-recipe-page">
      <div className="header">
        <h1>Create a Recipe</h1>
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
      <div className="create-recipe-container">
        <form onSubmit={createRecipe} className="recipe-form">
          <div className="form-group">
            <label htmlFor="recipeTitle">Recipe Title</label>
            <input
              type="text"
              id="recipeTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipeDescription">Description</label>
            <textarea
              id="recipeDescription"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (minutes)</label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cookTime">Cook Time (minutes)</label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipeImage">Image URL</label>
            <input
              type="url"
              id="recipeImage"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
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
                {tags.map((tag, index) => (
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
              {ingredients.map((ingredient, index) => (
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
              {instructions.map((instruction, index) => (
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

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipe;
