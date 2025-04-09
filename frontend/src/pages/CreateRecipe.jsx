import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "../styles/CreateRecipe.css";
import { jwtDecode } from "jwt-decode";

function CreateRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([
    { item: "", amount: "", unit: "" },
  ]);
  const [instructions, setInstructions] = useState([{ step: "" }]);
  const [username, setUsername] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !prepTime || !cookTime || !imageUrl) {
      alert("Please fill in all required fields");
      return;
    }

    if (ingredients.some((ing) => !ing.item || !ing.amount || !ing.unit)) {
      alert("Please fill in all ingredient fields");
      return;
    }

    if (instructions.some((inst) => !inst.step)) {
      alert("Please fill in all instruction steps");
      return;
    }

    const recipeData = {
      title,
      description,
      prep_time: parseInt(prepTime),
      cook_time: parseInt(cookTime),
      image_url: imageUrl,
      tags: JSON.stringify(tags),
      ingredients: JSON.stringify(
        ingredients.map((ing) => ({
          name: ing.item,
          amount: ing.amount,
          unit: ing.unit,
        }))
      ),
      instructions: JSON.stringify(instructions.map((inst) => inst.step)),
    };

    api
      .post("/api/recipes/", recipeData)
      .then((res) => {
        if (res.status === 201) {
          alert("Recipe created!");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error creating recipe:", error);
        alert("Failed to create recipe. Please check the console for details.");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      // Fetch user details
      fetch(`http://localhost:8000/api/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.username);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  return (
    <div className="create-recipe-container">
      <Navbar />
      <div className="content">
        <h1>Create New Recipe</h1>
        <form onSubmit={handleSubmit} className="create-recipe-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <textarea
              placeholder="Recipe Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-row time-inputs">
            <input
              type="text"
              placeholder="Preparation Time (e.g., 15 mins)"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Cooking Time (e.g., 30 mins)"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="tags-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-container">
              <input
                type="text"
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="add-tag-btn"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div className="form-row">
            <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient.item}
                  onChange={(e) =>
                    handleIngredientChange(index, "item", e.target.value)
                  }
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="add-btn"
            >
              Add Ingredient
            </button>
          </div>

          <div className="form-row">
            <h3>Instructions</h3>
            {instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <textarea
                  placeholder={`Step ${index + 1}`}
                  value={instruction.step}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  className="form-textarea"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInstruction}
              className="add-btn"
            >
              Add Step
            </button>
          </div>

          <button type="submit" className="submit-btn">
            Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRecipe;
