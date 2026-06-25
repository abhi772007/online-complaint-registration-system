const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createAgent,
  getAgents,
  getAgentByEmail,
} = require("../controllers/agentController");

router.post(
  "/agents",
  protect,
  adminOnly,
  [
    body("name").trim().notEmpty().withMessage("Agent name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("specialization")
      .trim()
      .notEmpty()
      .withMessage("Specialization is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validateRequest,
  createAgent
);

router.get("/agents", protect, adminOnly, getAgents);

router.get(
  "/agents/email/:email",
  protect,
  adminOnly,
  getAgentByEmail
);

module.exports = router;