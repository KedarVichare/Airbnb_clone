const express = require("express");
const {
  getProperties,
  searchProperties,
  getProperty,
} = require("../controllers/propertyController");

const router = express.Router();

// Traveler dashboard → list all properties
router.get("/", getProperties);

// Traveler search/filter → /api/properties/search?location=NYC&startDate=2025-09-28&endDate=2025-10-05
router.get("/search", searchProperties);

// View one property
router.get("/:id", getProperty);

module.exports = router;
