const db = require("../config/db");

async function createBooking({ travelerId, propertyId, startDate, endDate, guests }) {
  const [result] = await db.query(
    `INSERT INTO bookings
      (property_id, traveler_id, start_date, end_date, guests, status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [propertyId, travelerId, startDate, endDate, guests]
  );
  return result.insertId;
}


async function getBookingById(id) {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return rows[0] || null;
}


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

async function updateStatus(id, status) {
  const [res] = await db.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
  return res.affectedRows > 0;
}

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

async function getNextAvailableDate(propertyId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      `SELECT MAX(end_date) as latest_end_date
       FROM bookings
       WHERE property_id = ?
         AND status IN ('PENDING','ACCEPTED')
         AND end_date >= ?`,
      [propertyId, today]
    );
    
    if (rows[0] && rows[0].latest_end_date) {
      const nextDate = new Date(rows[0].latest_end_date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate.toISOString().split('T')[0];
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } catch (err) {
    console.error("Error getting next available date:", err);
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
