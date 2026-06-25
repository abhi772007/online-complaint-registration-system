const express = require("express");

const router = express.Router();

router.get("/admin", (req, res) => {
  res.send("ADMIN ROUTE WORKING");
});

router.get("/test-admin", (req, res) => {
  res.send("TEST ADMIN WORKING");
});

module.exports = router;