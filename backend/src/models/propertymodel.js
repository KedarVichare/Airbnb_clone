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
    let query = "SELECT * FROM properties WHERE 1=1";
    const params = [];

    if (location && location.trim() !== "") {
      query += " AND (LOWER(location) LIKE LOWER(?) OR LOWER(title) LIKE LOWER(?))";
      params.push(`%${location}%`, `%${location}%`);
    }

    if (startDate && endDate) {
      query += " AND available_from <= ? AND available_to >= ?";
      params.push(startDate, endDate);
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
