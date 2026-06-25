const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");

const createFeedback = async (req, res) => {
  try {
    const { rating, comment, complaint } = req.body;

    const existingComplaint = await Complaint.findById(complaint);
    if (!existingComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (existingComplaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the complaint owner can submit feedback" });
    }

    const feedback = await Feedback.create({
      rating,
      comment,
      complaint,
    });

    existingComplaint.feedback = comment;
    existingComplaint.rating = rating;
    await existingComplaint.save();

    res.status(201).json({
      message: "Feedback Submitted Successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
};