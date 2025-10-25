const express = require("express");
const router = express.Router();

// ✅ Make sure ALL four functions are imported
const {
  signup,
  login,
  logout,
  checkSession,
} = require("../controllers/authController");

// Auth routes
router.post("/:role/signup", signup);
router.post("/:role/login", login);
router.post("/logout", logout);
router.get("/check-session", checkSession); // ✅ Now this will work

module.exports = router;
