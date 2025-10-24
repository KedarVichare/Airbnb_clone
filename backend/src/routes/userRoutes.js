const express = require("express");
const router = express.Router();
const db = require("../config/db"); // <-- your DB connection

// ✅ GET user profile by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
  });
});

// ✅ UPDATE user profile
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, about, city, state, country, languages, gender } = req.body;

  const sql = `
    UPDATE users 
    SET name=?, email=?, phone=?, about=?, city=?, state=?, country=?, languages=?, gender=? 
    WHERE id=?;
  `;
  db.query(sql, [name, email, phone, about, city, state, country, languages, gender, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});

module.exports = router;