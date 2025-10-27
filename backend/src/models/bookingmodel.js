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
 * Note: Only considers PENDING and ACCEPTED bookings (CANCELLED bookings are excluded)
 * When owner cancels a booking, those dates become available again
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

/**
 * Get the next available date for a property
 * Returns the date after all active bookings end, or tomorrow if no active bookings
 * Note: Only considers PENDING and ACCEPTED bookings (CANCELLED bookings are excluded)
 */
async function getNextAvailableDate(propertyId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get the latest booking end date (excluding CANCELLED bookings)
    // When owner cancels a booking, those dates become available again
    const [rows] = await db.query(
      `SELECT MAX(end_date) as latest_end_date
       FROM bookings
       WHERE property_id = ?
         AND status IN ('PENDING','ACCEPTED')
         AND end_date >= ?`,
      [propertyId, today]
    );
    
    if (rows[0] && rows[0].latest_end_date) {
      // Return the day after the latest booking ends
      const nextDate = new Date(rows[0].latest_end_date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate.toISOString().split('T')[0];
    }
    
    // No upcoming bookings, available from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } catch (err) {
    console.error("Error getting next available date:", err);
    // Default to tomorrow on error
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
}

module.exports = {
  createBooking,
  getBookingById,
  listForTraveler,
  listForOwner,
  updateStatus,
  isPropertyAvailable,
  getNextAvailableDate,
};
