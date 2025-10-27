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

router.get("/", getProperties);

router.get("/search", searchProperties);

router.get("/:id", ensureLoggedIn, getProperty);

router.get("/owner/me", ensureOwner, getMyProperties);

router.post("/owner", ensureOwner, createMyProperty);

router.put("/owner/:id", ensureOwner, updateMyProperty);

router.delete("/owner/:id", ensureOwner, deleteMyProperty);

module.exports = router;
