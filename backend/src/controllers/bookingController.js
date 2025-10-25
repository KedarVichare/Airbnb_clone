const db = require("../config/db");
const Booking = require("../models/bookingmodel");

// ✅ Create Booking (Traveler)
exports.createBooking = async (req, res) => {
  try {
    // Get traveler ID from session (secure)
    const traveler_id = req.session.user?.id;
    const { property_id, start_date, end_date, guests } = req.body;
    const status = "PENDING"; // default

    // Check authentication
    if (!traveler_id || req.session.user?.role !== "traveler") {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Basic validation
    if (!property_id || !start_date || !end_date || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate date order
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: "end_date must be after start_date" });
    }

    // ✅ Check for overlapping bookings for the same property
    const [conflicts] = await db.query(
      `SELECT 1 FROM bookings
       WHERE property_id = ?
       AND status IN ('PENDING','ACCEPTED')
       AND NOT (end_date < ? OR start_date > ?)`,
      [property_id, start_date, end_date]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ error: "Property not available for these dates" });
    }

    // ✅ Insert booking
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

// ✅ List all bookings (admin/debug use)
exports.listBookings = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ✅ Traveler: Get all bookings by logged-in traveler
exports.getBookingsByTraveler = async (req, res) => {
  try {
    const traveler_id = req.session.user?.id;
    if (!traveler_id || req.session.user?.role !== "traveler") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const [rows] = await db.query(
      `SELECT 
         b.id AS booking_id,
         b.start_date,
         b.end_date,
         b.guests,
         b.status,
         p.id AS property_id,
         p.title,
         p.location,
         p.price,
         p.photo_url
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.traveler_id = ?
       ORDER BY b.created_at DESC`,
      [traveler_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No bookings found for this traveler" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching traveler bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Owner: Get bookings for all their properties
exports.getBookingsByOwner = async (req, res) => {
  try {
    const owner_id = req.session.user?.id;
    if (!owner_id || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const [rows] = await db.query(
      `SELECT 
         b.id AS booking_id,
         b.start_date,
         b.end_date,
         b.guests,
         b.status,
         p.id AS property_id,
         p.title,
         p.location,
         p.price,
         p.photo_url
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE p.owner_id = ?
       ORDER BY b.created_at DESC`,
      [owner_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No bookings found for this owner" });

    res.json(rows);
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Accept booking (owner only)
exports.acceptBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    // Confirm booking belongs to one of the owner's properties
    const [check] = await db.query(
      `SELECT b.id
       FROM bookings b
       JOIN properties p ON p.id = b.property_id
       WHERE b.id = ? AND p.owner_id = ?`,
      [id, ownerId]
    );

    if (check.length === 0)
      return res.status(403).json({ message: "You are not the owner of this booking" });

    const success = await Booking.updateStatus(id, "ACCEPTED");
    if (success) return res.json({ message: "Booking accepted successfully" });
    res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    console.error("Error accepting booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cancel booking (owner only)
exports.cancelBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    // Confirm booking belongs to one of the owner's properties
    const [check] = await db.query(
      `SELECT b.id
       FROM bookings b
       JOIN properties p ON p.id = b.property_id
       WHERE b.id = ? AND p.owner_id = ?`,
      [id, ownerId]
    );

    if (check.length === 0)
      return res.status(403).json({ message: "You are not the owner of this booking" });

    const success = await Booking.updateStatus(id, "CANCELLED");
    if (success) return res.json({ message: "Booking cancelled successfully" });
    res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
