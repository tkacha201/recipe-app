const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const auth = require("../middleware/auth");

// @route   GET /api/recipes/all
// @desc    Get all recipes
// @access  Public
router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("createdBy", "name email")
      .populate("likes");
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/recipes/recipe/:id
// @desc    Get recipe by ID
// @access  Public
router.get("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("likes");

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/recipes/create
// @desc    Create a recipe
// @access  Private
router.post("/create", auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl } = req.body;

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      imageUrl,
      createdBy: req.user.id,
    });

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/recipes/edit/:id
// @desc    Update a recipe
// @access  Private
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, imageUrl } = req.body;

    // Find recipe and check ownership
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Make sure user owns the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Update recipe
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions, imageUrl },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/recipes/delete/:id
// @desc    Delete a recipe
// @access  Private
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    // Find recipe and check ownership
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Make sure user owns the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/recipes/like/:id
// @desc    Like a recipe
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Check if the recipe has already been liked by this user
    if (recipe.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Recipe already liked" });
    }

    // Add user id to likes array
    recipe.likes.unshift(req.user.id);
    await recipe.save();

    return res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/recipes/unlike/:id
// @desc    Unlike a recipe
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Check if the recipe has been liked by this user
    if (!recipe.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Recipe has not yet been liked" });
    }

    // Remove user id from likes array
    recipe.likes = recipe.likes.filter(
      (like) => like.toString() !== req.user.id
    );
    await recipe.save();

    return res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/recipes/user/:userId
// @desc    Get recipes created by a specific user
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.params.userId })
      .populate("createdBy", "name email")
      .populate("likes")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/recipes/my-recipes
// @desc    Get recipes created by logged in user
// @access  Private
router.get("/my-recipes", auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("likes")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
