const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { ensureTraveler, ensureOwner } = require("../middlewares/authmiddleware");

router.post("/", ensureTraveler, bookingController.createBooking);
router.get("/traveler", ensureTraveler, bookingController.getBookingsByTraveler);

router.get("/owner", ensureOwner, bookingController.getBookingsByOwner);
router.put("/:id/accept", ensureOwner, bookingController.acceptBooking);
router.put("/:id/cancel", bookingController.cancelBooking);


module.exports = router;
