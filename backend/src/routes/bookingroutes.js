const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/", bookingController.listBookings);
router.get("/traveler/:id", bookingController.getBookingsByTraveler);
router.put("/:id/accept", bookingController.acceptBooking);
router.put("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
