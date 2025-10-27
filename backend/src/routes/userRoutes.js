const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/me", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { name, email, phone, about, city, state, country, languages, gender } = req.body;

    await db.query(
      `UPDATE users 
       SET name=?, email=?, phone=?, about=?, city=?, state=?, country=?, languages=?, gender=? 
       WHERE id=?`,
      [name, email, phone, about, city, state, country, languages, gender, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
