const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);