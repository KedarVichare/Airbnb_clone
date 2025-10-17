// src/models/bookingModel.js
const db = require("../config/db");

/**
 * Create a booking → status PENDING
 */
async function createBooking({ travelerId, propertyId, startDate, endDate, guests }) {
  const [result] = await db.query(
    `INSERT INTO bookings
      (property_id, traveler_id, start_date, end_date, guests, status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [propertyId, travelerId, startDate, endDate, guests]
  );
  return result.insertId;
}

/**
 * Get a single booking by id
 */
async function getBookingById(id) {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return rows[0] || null;
}

/**
 * List bookings for a traveler (joins property info for convenience)
 */
async function listForTraveler(travelerId) {
  const [rows] = await db.query(
    `SELECT b.*, p.title, p.city, p.state
       FROM bookings b
       JOIN properties p ON p.id = b.property_id
      WHERE b.traveler_id = ?
      ORDER BY b.created_at DESC`,
    [travelerId]
  );
  return rows;
}

/**
 * List bookings for an owner (uses properties.owner_id)
 * Requires your properties table to have an owner_id column.
 */
async function listForOwner(ownerId) {
  const [rows] = await db.query(
    `SELECT b.*, p.title, p.city, p.state
       FROM bookings b
       JOIN properties p ON p.id = b.property_id
      WHERE p.owner_id = ?
      ORDER BY b.created_at DESC`,
    [ownerId]
  );
  return rows;
}

/**
 * Update status (ACCEPTED, CANCELLED, PENDING)
 */
async function updateStatus(id, newStatus) {
  const [res] = await db.query(
    `UPDATE bookings SET status = ? WHERE id = ?`,
    [newStatus, id]
  );
  return res.affectedRows === 1;
}

/**
 * Convenience wrappers
 */
async function acceptBooking(id) {
  return updateStatus(id, "ACCEPTED");
}

async function cancelBooking(id) {
  return updateStatus(id, "CANCELLED");
}

/**
 * Optional: Check overlapping bookings for a property
 * Returns true if the property is free in the requested window.
 */
async function isPropertyAvailable(propertyId, startDate, endDate) {
  const [rows] = await db.query(
    `SELECT 1
       FROM bookings
      WHERE property_id = ?
        AND status IN ('PENDING','ACCEPTED')
        AND NOT (end_date < ? OR start_date > ?)
      LIMIT 1`,
    [propertyId, startDate, endDate]
  );
  return rows.length === 0;
}

module.exports = {
  createBooking,
  getBookingById,
  listForTraveler,
  listForOwner,
  updateStatus,
  acceptBooking,
  cancelBooking,
  isPropertyAvailable,
};
