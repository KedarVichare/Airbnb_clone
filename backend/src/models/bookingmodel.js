// src/models/bookingModel.js
const db = require("../config/db");

/**
 * Create a booking (default: PENDING)
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
 * Get a single booking by ID
 */
async function getBookingById(id) {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return rows[0] || null;
}

/**
 * Get all bookings for a traveler (with property details)
 */
async function listForTraveler(travelerId) {
  const [rows] = await db.query(
    `SELECT 
        b.*, 
        p.title AS property_title, 
        p.location, 
        p.price, 
        p.photo_url
     FROM bookings b
     JOIN properties p ON p.id = b.property_id
     WHERE b.traveler_id = ?
     ORDER BY b.created_at DESC`,
    [travelerId]
  );
  return rows;
}

/**
 * Get all bookings for an owner (joins properties table)
 */
async function listForOwner(ownerId) {
  const [rows] = await db.query(
    `SELECT 
        b.*, 
        p.title AS property_title, 
        p.location, 
        p.price, 
        p.photo_url
     FROM bookings b
     JOIN properties p ON p.id = b.property_id
     WHERE p.owner_id = ?
     ORDER BY b.created_at DESC`,
    [ownerId]
  );
  return rows;
}

/**
 * Update booking status (ACCEPTED / CANCELLED / PENDING)
 */
async function updateStatus(id, status) {
  const [res] = await db.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
  return res.affectedRows > 0;
}

/**
 * Check if a property is available within the given date range
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
  isPropertyAvailable,
};
