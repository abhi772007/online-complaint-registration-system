const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  createTestUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

router.get("/create-user", createTestUser);

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validateRequest,
  loginUser
);

router.get("/profile", protect, getCurrentUser);
router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
    body("phone").optional().trim(),
  ],
  validateRequest,
  updateUserProfile
);

module.exports = router;