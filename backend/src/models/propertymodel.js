const db = require("../config/db");

// Create a new property (for owners)
const createProperty = async ({ title, description, location, price, owner_id }) => {
  const [result] = await db.query(
    `INSERT INTO properties (title, description, location, price, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, location, price, owner_id]
  );
  return result.insertId;
};

// Get all properties (for traveler dashboard)
const getAllProperties = async () => {
  const [rows] = await db.query(
    "SELECT id, title, price, location, photo_url, available_from, available_to FROM properties"
  );
  return rows;
};

// Filter properties by location and date
const filterProperties = async (location, startDate, endDate) => {
  try {
    let query = "SELECT * FROM properties WHERE 1=1";
    const params = [];

    // 🏙️ Case-insensitive partial match on location or title
    if (location && location.trim() !== "") {
      query += " AND (LOWER(location) LIKE LOWER(?) OR LOWER(title) LIKE LOWER(?))";
      params.push(`%${location}%`, `%${location}%`);
    }

    // 📅 Optional: Only filter by date if both start and end provided
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

// Get a property by ID (for property details page)
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
