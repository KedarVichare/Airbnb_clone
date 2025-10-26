// backend/src/routes/propertyRoutes.js
const express = require("express");
const router = express.Router();
const {
  getProperties,
  searchProperties,
  getProperty,
  getMyProperties,
  createMyProperty,
  updateMyProperty,
  deleteMyProperty,
} = require("../controllers/propertyController");

const { ensureOwner, ensureLoggedIn } = require("../middlewares/authmiddleware");

// =========================
// 🌍 Traveler / Public Routes
// =========================

// ✅ Get all available properties (public / traveler)
router.get("/", getProperties);

// ✅ Search properties by location or date (public / traveler)
router.get("/search", searchProperties);

// ✅ View single property details (must be logged in)
router.get("/:id", ensureLoggedIn, getProperty);

// =========================
// 🏠 Owner Routes (Protected)
// =========================

// ✅ View all properties posted by this owner
router.get("/owner/me", ensureOwner, getMyProperties);

// ✅ Create new property listing
router.post("/owner", ensureOwner, createMyProperty);

// ✅ Update property listing
router.put("/owner/:id", ensureOwner, updateMyProperty);

// ✅ Delete property listing
router.delete("/owner/:id", ensureOwner, deleteMyProperty);

module.exports = router;
