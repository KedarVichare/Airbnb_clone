const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Add property to favourites
router.post("/add", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { propertyId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not logged in" });
    if (!propertyId) return res.status(400).json({ message: "Property ID required" });

    await db.query(
      "INSERT IGNORE INTO favourites (user_id, property_id) VALUES (?, ?)",
      [userId, propertyId]
    );

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Error adding favourite:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Remove property from favourites
router.delete("/remove/:propertyId", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { propertyId } = req.params;

    if (!userId) return res.status(401).json({ message: "Not logged in" });

    await db.query(
      "DELETE FROM favourites WHERE user_id = ? AND property_id = ?",
      [userId, propertyId]
    );

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("Error removing favourite:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Get all favourites for logged-in user
router.get("/my-favourites", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const [rows] = await db.query(
      `SELECT p.* 
       FROM favourites f
       JOIN properties p ON f.property_id = p.id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
