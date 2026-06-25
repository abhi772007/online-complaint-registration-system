const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  getComplaintDetails,
  updateComplaintStatus,
  assignAgent,
  updateComplaint,
} = require("../controllers/complaintController");

const {
  protect,
  adminOnly,
  agentOnly,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

router.post(
  "/complaints",
  protect,
  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required."),
  ],
  validateRequest,
  createComplaint
);

router.get("/complaints", protect, getAllComplaints);
router.get("/complaints/:id", protect, getComplaintDetails);

router.put(
  "/complaints/:id",
  protect,
  agentOnly,
  [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required."),
  ],
  validateRequest,
  updateComplaintStatus
);

router.put(
  "/complaints/edit/:id",
  protect,
  adminOnly,
  updateComplaint
);

router.post(
  "/assign-agent",
  protect,
  adminOnly,
  [
    body("complaintId")
      .trim()
      .notEmpty()
      .withMessage("Complaint ID is required."),
    body("agentId")
      .trim()
      .notEmpty()
      .withMessage("Agent ID is required."),
  ],
  validateRequest,
  assignAgent
);

module.exports = router;
