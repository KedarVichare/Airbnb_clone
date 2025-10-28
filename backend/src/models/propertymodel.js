const db = require("../config/db");

const createProperty = async ({ title, description, type, location, price, owner_id }) => {
  const [result] = await db.query(
    `INSERT INTO properties (title, type, description, location, price, owner_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, type, description, location, price, owner_id]
  );
  return result.insertId;
};

const getAllProperties = async () => {
  const [rows] = await db.query(
    "SELECT id, title, type, price, location, photo_url, available_from, available_to FROM properties"
  );
  return rows;
};

const filterProperties = async (location, startDate, endDate) => {
  try {
    let query = `
      SELECT DISTINCT p.* 
      FROM properties p 
      LEFT JOIN bookings b ON p.id = b.property_id
      WHERE 1=1
    `;
    const params = [];

    if (location && location.trim() !== "") {
      query += " AND (LOWER(p.location) LIKE LOWER(?) OR LOWER(p.title) LIKE LOWER(?))";
      params.push(`%${location}%`, `%${location}%`);
    }

    if (startDate && endDate) {
      query += ` AND NOT EXISTS (
                   SELECT 1 FROM bookings b2 
                   WHERE b2.property_id = p.id 
                   AND b2.status = 'ACCEPTED'
                   AND (
                     (? BETWEEN b2.start_date AND b2.end_date) OR
                     (? BETWEEN b2.start_date AND b2.end_date) OR
                     (b2.start_date BETWEEN ? AND ?) OR
                     (b2.end_date BETWEEN ? AND ?)
                   )
                 )`;
      params.push(
        startDate,
        endDate,
        startDate, endDate,
        startDate, endDate
      );
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error("Error filtering properties:", err);
    throw err;
  }
};

const getPropertyById = async (id) => {
  const [rows] = await db.query("SELECT * FROM properties WHERE id = ?", [id]);
  return rows[0];
};

module.exports = {
  createProperty,
  getAllProperties,
  filterProperties,
  getPropertyById,
};
