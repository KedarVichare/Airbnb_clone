const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middlewares/uploadMiddleware");
const path = require("path");
const fs = require("fs").promises;

const uploadsDir = path.join(__dirname, "../../uploads/profiles");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

router.get("/test-image/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  res.sendFile(filePath);
});

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

router.put("/update", upload.single('profile_image'), async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { name, email, phone, about, location, city, state, country, languages, gender } = req.body;
    
    let profile_image = undefined;
    if (req.file) {
      profile_image = `/uploads/profiles/${path.basename(req.file.path)}`;
    }

    const updateFields = [
      'name=?', 'email=?', 'phone=?', 'about=?', 'location=?', 
      'city=?', 'state=?', 'country=?', 'languages=?', 'gender=?'
    ];
    const updateValues = [
      name, email, phone, about, location, 
      city, state, country, languages, gender
    ];

    if (profile_image) {
      updateFields.push('profile_image=?');
      updateValues.push(profile_image);
    }

    updateValues.push(userId); 

    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id=?`,
      updateValues
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
