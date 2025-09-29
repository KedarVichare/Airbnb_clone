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
  const [rows] = await db.query(
    `SELECT * FROM properties
     WHERE location = ? 
       AND available_from <= ? 
       AND available_to >= ?`,
    [location, startDate, endDate]
  );
  return rows;
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
