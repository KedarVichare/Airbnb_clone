const pool = require("../config/db");

// Create a new user (Traveler or Owner)
const createUser = async (user) => {
  const [result] = await pool.query(
    `INSERT INTO users 
      (name, email, password, role, phone, city, country, language, gender, location) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.name,
      user.email,
      user.password, // hashed before calling this function
      user.role,
      user.phone,
      user.city,
      user.country,
      user.language,
      user.gender,
      user.location || null, // only for owner
    ]
  );
  return result.insertId; // returns new user's ID
};

// Find a user by email (for login / signup check)
const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // return first match
};

// Find a user by ID (for session/profile)
const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

// Update user profile (Traveler or Owner)
const updateUser = async (id, data) => {
  const fields = [];
  const values = [];

  // Build dynamic query only for fields provided
  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }
  values.push(id);

  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
  return result.affectedRows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
