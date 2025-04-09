import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Recipe from "../components/Recipe";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState([""]);

  useEffect(() => {
    getRecipes();
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleCreateRecipe = () => {
    navigate("/create-recipe");
  };

  const getRecipes = () => {
    api
      .get("/api/recipes/")
      .then((res) => res.data)
      .then((data) => {
        setRecipes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteRecipe = (id) => {
    api
      .delete(`/api/recipes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Recipe deleted!");
        else alert("Failed to delete recipe.");
        getRecipes();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert("You don't have permission to delete this recipe.");
        } else {
          alert(error);
        }
      });
  };

  const updateRecipe = (id, updatedData) => {
    api
      .put(`/api/recipes/update/${id}/`, updatedData)
      .then((res) => {
        if (res.status === 200) alert("Recipe updated!");
        else alert("Failed to update recipe.");
        getRecipes();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert("You don't have permission to update this recipe.");
        } else {
          alert(error);
        }
      });
  };

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
    setInstructions(newInstructions);
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
        if (res.status === 201) alert("Recipe created!");
        else alert("Failed to create recipe.");
        getRecipes();
        // Clear form after successful creation
        setTitle("");
        setDescription("");
        setPrepTime("");
        setCookTime("");
        setImageUrl("");
        setTags([]);
        setIngredients([{ name: "", amount: "" }]);
        setInstructions([""]);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="logo">
          <svg
            className="chef-hat-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C9.5 2 7.5 3.5 7 5.5C7 5.5 7 5.5 7 5.5C5.5 5.5 4 6.5 4 8C4 9.5 5 10.5 6.5 10.5C6.5 10.5 6.5 10.5 6.5 10.5C6.5 12.5 7.5 14 9 14.5V19H15V14.5C16.5 14 17.5 12.5 17.5 10.5C17.5 10.5 17.5 10.5 17.5 10.5C19 10.5 20 9.5 20 8C20 6.5 18.5 5.5 17 5.5C17 5.5 17 5.5 17 5.5C16.5 3.5 14.5 2 12 2Z" />
          </svg>
          <h1>TastyHub</h1>
        </div>
        <div className="header-buttons">
          <button className="create-recipe-btn" onClick={handleCreateRecipe}>
            Create Recipe
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Share Your Favorite Recipes With the World</h2>
          <p>Join our community of food lovers and discover amazing recipes</p>
          <button className="hero-cta-btn" onClick={handleCreateRecipe}>
            Share a Recipe
          </button>
        </div>
      </div>

      <div className="recipes-feed">
        <h2>Recipe Feed</h2>
        <p className="feed-description">All recipes from all users</p>
        {recipes.map((recipe) => (
          <Recipe
            recipe={recipe}
            onDelete={deleteRecipe}
            onUpdate={updateRecipe}
            key={recipe.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
