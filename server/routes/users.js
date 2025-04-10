const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    // The auth middleware adds the user ID to req.user
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/users/update-profile
// @desc    Update user profile
// @access  Private
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update basic info if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      console.log("Password verification:", { isMatch, userId: user._id });

      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long" });
      }

      // Set new password - it will be hashed by the pre-save middleware
      user.password = newPassword;
    }

    // Save the updated user
    await user.save();

    // Return user without password
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
