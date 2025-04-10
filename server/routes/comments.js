const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { text, recipeId } = req.body;

    if (!text || !recipeId) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const newComment = new Comment({
      text,
      recipeId,
      userId: req.user.id,
    });

    const comment = await newComment.save();

    // Populate user details
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "name"
    );

    res.json(populatedComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/comments/:recipeId
// @desc    Get all comments for a recipe
// @access  Public
router.get("/:recipeId", async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Check user ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Comment.deleteOne({ _id: req.params.id });

    res.json({ msg: "Comment removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
