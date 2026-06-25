const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    attachments: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "RESOLVED",
        "DUPLICATE",
      ],
      default: "PENDING",
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
      index: true,
    },

    feedback: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    adminRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);