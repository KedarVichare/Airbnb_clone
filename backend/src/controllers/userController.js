const db = require("../config/db");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { name, email, phone, about, city, state, country, languages, gender } = req.body;

    await db.query(
      "UPDATE users SET name=?, email=?, phone=?, about=?, city=?, state=?, country=?, languages=?, gender=? WHERE id=?",
      [name, email, phone, about, city, state, country, languages, gender, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
