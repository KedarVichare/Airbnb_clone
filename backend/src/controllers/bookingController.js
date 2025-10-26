// backend/src/controllers/bookingController.js
const db = require("../config/db");
const Booking = require("../models/bookingModel");

/**
 * ✅ Traveler: Create a new booking request
 */
exports.createBooking = async (req, res) => {
  try {
    const travelerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { property_id, start_date, end_date, guests } = req.body;

    // 🔒 Auth check
    if (!travelerId || userRole !== "traveler") {
      return res.status(401).json({ message: "Not authorized. Traveler login required." });
    }

    // 🧾 Input validation
    if (!property_id || !start_date || !end_date || !guests) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    // ✅ Check property availability
    const available = await Booking.isPropertyAvailable(property_id, start_date, end_date);
    if (!available) {
      return res.status(409).json({ message: "Property not available for selected dates." });
    }

    // ✅ Create booking (PENDING by default)
    const bookingId = await Booking.createBooking({
      travelerId,
      propertyId: property_id,
      startDate: start_date,
      endDate: end_date,
      guests,
    });

    res.status(201).json({
      success: true,
      message: "Booking request created successfully (status: PENDING).",
      bookingId,
    });
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ message: "Server error creating booking." });
  }
};

/**
 * ✅ Admin/Debug: List all bookings
 */
exports.listBookings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error listing bookings:", err);
    res.status(500).json({ message: "Server error listing bookings." });
  }
};

/**
 * ✅ Traveler: Get all bookings by logged-in traveler
 */
exports.getBookingsByTraveler = async (req, res) => {
  try {
    const travelerId = req.session.user?.id;
    if (!travelerId || req.session.user?.role !== "traveler") {
      return res.status(401).json({ message: "Not authorized. Traveler only." });
    }

    const rows = await Booking.listForTraveler(travelerId);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching traveler bookings:", err);
    res.status(500).json({ message: "Server error fetching traveler bookings." });
  }
};

/**
 * ✅ Owner: Get bookings for all their properties
 */
exports.getBookingsByOwner = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner login required." });
    }

    // ✅ Join bookings + traveler + property info
    const [rows] = await db.query(
      `SELECT 
          b.id AS booking_id,
          b.start_date,
          b.end_date,
          b.guests,
          b.status,
          b.created_at,
          p.id AS property_id,
          p.title AS property_title,
          p.location,
          p.price,
          p.photo_url,
          u.name AS traveler_name,
          u.email AS traveler_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.traveler_id = u.id
        WHERE p.owner_id = ?
        ORDER BY b.created_at DESC`,
      [ownerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching owner bookings:", err);
    res.status(500).json({ message: "Server error fetching owner bookings." });
  }
};

/**
 * ✅ Owner: Accept a booking
 */
exports.acceptBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { id } = req.params;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner only." });
    }

    // ✅ Verify booking belongs to one of the owner's properties
    const [check] = await db.query(
      `SELECT b.*, p.owner_id 
         FROM bookings b
         JOIN properties p ON p.id = b.property_id
        WHERE b.id = ? AND p.owner_id = ?`,
      [id, ownerId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: "You are not the owner of this booking." });
    }

    // ✅ Update booking status
    const updated = await Booking.updateStatus(id, "ACCEPTED");
    if (!updated) return res.status(404).json({ message: "Booking not found." });

    // ✅ Optionally block property availability for that period
    const booking = check[0];
    await db.query(
      `UPDATE properties 
         SET available_from = DATE_ADD(?, INTERVAL 1 DAY), 
             available_to = ?
       WHERE id = ?`,
      [booking.start_date, booking.end_date, booking.property_id]
    );

    res.json({ success: true, message: "Booking accepted successfully." });
  } catch (err) {
    console.error("❌ Error accepting booking:", err);
    res.status(500).json({ message: "Server error accepting booking." });
  }
};

/**
 * ✅ Owner: Cancel or Reject a booking
 */
exports.cancelBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { id } = req.params;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner only." });
    }

    // ✅ Verify booking ownership
    const [check] = await db.query(
      `SELECT b.*, p.owner_id 
         FROM bookings b
         JOIN properties p ON p.id = b.property_id
        WHERE b.id = ? AND p.owner_id = ?`,
      [id, ownerId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: "You are not the owner of this booking." });
    }

    // ✅ Update booking status
    const updated = await Booking.updateStatus(id, "CANCELLED");
    if (!updated) return res.status(404).json({ message: "Booking not found." });

    // ✅ Optionally restore property availability
    await db.query(
      `UPDATE properties 
         SET available_from = CURDATE(), 
             available_to = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       WHERE id = ?`,
      [check[0].property_id]
    );

    res.json({ success: true, message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("❌ Error cancelling booking:", err);
    res.status(500).json({ message: "Server error cancelling booking." });
  }
};
