const express = require("express");
const { signup, login, logout } = require("../controllers/authController");

const router = express.Router();

// Traveler routes
router.post("/traveler/signup", signup);
router.post("/traveler/login", login);

// Owner routes
router.post("/owner/signup", signup);
router.post("/owner/login", login);

// Common
router.post("/logout", logout);

module.exports = router;
