const express = require("express");

const router = express.Router();

const { testFunction } = require("../controllers/testController");

router.get("/test", testFunction);

module.exports = router;