const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { ensureTraveler, ensureOwner } = require("../middlewares/authmiddleware");

// Traveler routes
router.post("/", ensureTraveler, bookingController.createBooking);
router.get("/traveler", ensureTraveler, bookingController.getBookingsByTraveler);

// Owner routes
router.get("/owner", ensureOwner, bookingController.getBookingsByOwner);
router.put("/:id/accept", ensureOwner, bookingController.acceptBooking);
router.put("/:id/cancel", ensureOwner, bookingController.cancelBooking);

// Optional admin/debug
router.get("/", bookingController.listBookings);

module.exports = router;
