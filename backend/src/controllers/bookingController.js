const db = require("../config/db");
const Booking = require("../models/bookingmodel");


exports.createBooking = async (req, res) => {
  try {
    const travelerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { property_id, start_date, end_date, guests } = req.body;

    if (!travelerId || userRole !== "traveler") {
      return res.status(401).json({ message: "Not authorized. Traveler login required." });
    }

    if (!property_id || !start_date || !end_date || !guests) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    const available = await Booking.isPropertyAvailable(property_id, start_date, end_date);
    if (!available) {
      return res.status(409).json({ message: "Property not available for selected dates." });
    }

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
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error creating booking." });
  }
};


exports.listBookings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error listing bookings:", err);
    res.status(500).json({ message: "Server error listing bookings." });
  }
};


exports.getBookingsByTraveler = async (req, res) => {
  try {
    const travelerId = req.session.user?.id;
    if (!travelerId || req.session.user?.role !== "traveler") {
      return res.status(401).json({ message: "Not authorized. Traveler only." });
    }

    const rows = await Booking.listForTraveler(travelerId);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching traveler bookings:", err);
    res.status(500).json({ message: "Server error fetching traveler bookings." });
  }
};

exports.getBookingsByOwner = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner login required." });
    }

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
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ message: "Server error fetching owner bookings." });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { id } = req.params;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner only." });
    }

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

    const updated = await Booking.updateStatus(id, "ACCEPTED");
    if (!updated) return res.status(404).json({ message: "Booking not found." });

    res.json({ success: true, message: "Booking accepted successfully." });
  } catch (err) {
    console.error("Error accepting booking:", err);
    res.status(500).json({ message: "Server error accepting booking." });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    const userRole = req.session.user?.role;
    const { id } = req.params;

    if (!ownerId || userRole !== "owner") {
      return res.status(401).json({ message: "Not authorized. Owner only." });
    }

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

    const updated = await Booking.updateStatus(id, "CANCELLED");
    if (!updated) return res.status(404).json({ message: "Booking not found." });

    res.json({ success: true, message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Server error cancelling booking." });
  }
};
