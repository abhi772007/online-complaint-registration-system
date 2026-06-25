const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const createTestUser = async (req, res) => {
  try {
    const user = await User.create({
      name: "Abhilasha",
      email: "abhilasha@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "USER",
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    let agentId = null;
    if (user.role === "AGENT") {
      const Agent = require("../models/Agent");
      const agent = await Agent.findOne({ email: normalizedEmail });
      if (agent) {
        agentId = agent._id;
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        agentId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agentId,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email phone role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) {
      user.name = name;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTestUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
};