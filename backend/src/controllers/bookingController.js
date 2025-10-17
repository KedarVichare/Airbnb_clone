const db = require("../config/db");
const Booking = require("../models/bookingmodel");

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { traveler_id, property_id, start_date, end_date, guests } = req.body;
    const status = req.body.status || "PENDING"; // Default to PENDING

    // Basic validation
    if (!traveler_id || !property_id || !start_date || !end_date || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate date order
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "end_date must be after start_date" });
    }

    // Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings (traveler_id, property_id, start_date, end_date, guests, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [traveler_id, property_id, start_date, end_date, guests, status]
    );

    res
      .status(201)
      .json({ message: `Booking created with status ${status}`, bookingId: result.insertId });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ List all bookings
exports.listBookings = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ✅ Get bookings by traveler ID
exports.getBookingsByTraveler = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM bookings WHERE traveler_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No bookings found for this traveler" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching traveler bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Accept booking
exports.acceptBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await Booking.updateStatus(id, "ACCEPTED"); // ✅ fixed
    if (success) return res.json({ message: "Booking accepted successfully" });
    res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    next(err);
  }
};

// ✅ Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await Booking.updateStatus(id, "CANCELLED"); // ✅ fixed
    if (success) return res.json({ message: "Booking cancelled successfully" });
    res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    next(err);
  }
};
