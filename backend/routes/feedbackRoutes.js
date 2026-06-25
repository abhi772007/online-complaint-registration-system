const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { createFeedback } = require("../controllers/feedbackController");

router.post(
  "/feedback",
  protect,
  [
    body("complaint").notEmpty().withMessage("Complaint ID is required."),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("Comment is required."),
  ],
  validateRequest,
  createFeedback
);

module.exports = router;