const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      default: "AGENT",
    },

    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Agent", agentSchema);