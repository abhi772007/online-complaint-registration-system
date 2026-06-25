const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, attachments = [] } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      attachments,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Complaint Created Successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "USER") {
      filter.user = req.user.id;
    } else if (req.user.role === "AGENT") {
      filter.assignedAgent = req.user.agentId || req.user.id;
    }

    const complaints = await Complaint.find(filter)
      .populate("assignedAgent", "name email specialization")
      .populate("user", "name email");

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("assignedAgent", "name email specialization")
      .populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      req.user.role === "USER" &&
      complaint.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      req.user.role === "AGENT" &&
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() !== req.user.agentId &&
      complaint.assignedAgent._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      complaint.assignedAgent &&
      complaint.assignedAgent.toString() !== req.user.agentId &&
      complaint.assignedAgent.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      message: "Complaint Updated Successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const assignAgent = async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    complaint.assignedAgent = agentId;
    complaint.status = "IN_PROGRESS";
    await complaint.save();

    if (!agent.assignedComplaints.includes(complaint._id)) {
      agent.assignedComplaints.push(complaint._id);
      await agent.save();
    }

    res.status(200).json({
      message: "Agent Assigned Successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint Updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintDetails,
  updateComplaintStatus,
  assignAgent,
  updateComplaint,
};