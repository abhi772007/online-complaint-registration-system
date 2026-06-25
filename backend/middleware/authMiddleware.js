const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "ADMIN"
  ) {
    next();
  } else {
    return res.status(403).json({
      message:
        "Access Denied. Admin Only",
    });
  }
};

const agentOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "AGENT"
  ) {
    next();
  } else {
    return res.status(403).json({
      message:
        "Access Denied. Agent Only",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
  agentOnly,
};