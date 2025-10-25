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
const { ensureOwner } = require("../middlewares/authmiddleware");

// Traveler routes
router.get("/", getProperties);
router.get("/search", searchProperties);
router.get("/:id", getProperty);

// Owner routes (protected)
router.get("/owner/me", ensureOwner, getMyProperties);
router.post("/owner", ensureOwner, createMyProperty);
router.put("/owner/:id", ensureOwner, updateMyProperty);
router.delete("/owner/:id", ensureOwner, deleteMyProperty);

module.exports = router;
