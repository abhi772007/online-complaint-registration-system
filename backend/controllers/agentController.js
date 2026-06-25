const Agent = require("../models/Agent");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAgent = async (req, res) => {
  try {
    const { name, email, specialization, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "AGENT",
    });

    const agent = await Agent.create({
      name,
      email: normalizedEmail,
      specialization,
      userId: user._id,
    });

    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    res.json(agents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAgentByEmail = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      email: req.params.email,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAgent,
  getAgents,
  getAgentByEmail,
};