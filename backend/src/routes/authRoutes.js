const express = require("express");
const router = express.Router();
const { signup, login, logout, checkSession } = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check-session", checkSession);

module.exports = router;
