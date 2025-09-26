const express = require("express");
const { signup, login, logout } = require("../controllers/authController");

const router = express.Router();

// Traveler signup/login
router.post("/traveler/signup", signup);
router.post("/traveler/login", login);

// Owner signup/login
router.post("/owner/signup", signup);
router.post("/owner/login", login);

// Logout (common for both)
router.post("/logout", logout);

module.exports = router;
