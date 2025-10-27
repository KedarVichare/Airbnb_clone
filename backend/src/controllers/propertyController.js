const {
  createProperty,
  getAllProperties,
  filterProperties,
  getPropertyById,
} = require("../models/propertymodel");
const { getNextAvailableDate } = require("../models/bookingmodel");
const db = require("../config/db");

exports.getMyProperties = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }
    const [rows] = await db.query(
    `SELECT id, title, type, location, price, amenities, bedrooms, bathrooms, available_from, available_to, photo_url
      FROM properties WHERE owner_id = ? ORDER BY created_at DESC`,
      [ownerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("getMyProperties error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createMyProperty = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }
    const {
      title, description, type, location, price,
      amenities, bedrooms, bathrooms, available_from, available_to, photo_url
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO properties
         (owner_id, title, type, description, location, price, amenities, bedrooms, bathrooms, available_from, available_to, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, title, type, description, location, price, amenities, bedrooms, bathrooms, available_from, available_to, photo_url]
    );
    res.status(201).json({ message: "Property created", id: result.insertId });
  } catch (err) {
    console.error("createMyProperty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMyProperty = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { id } = req.params;
    const [check] = await db.query(`SELECT id FROM properties WHERE id = ? AND owner_id = ?`, [id, ownerId]);
    if (check.length === 0) return res.status(403).json({ message: "You don't own this property" });

    const {
      title, description, type, location, price,
      amenities, bedrooms, bathrooms, available_from, available_to, photo_url
    } = req.body;

    await db.query(
      `UPDATE properties
          SET title=?, type=?, description=?, location=?, price=?, amenities=?, bedrooms=?, bathrooms=?, available_from=?, available_to=?, photo_url=?
        WHERE id=?`,
      [title, type, description, location, price, amenities, bedrooms, bathrooms, available_from, available_to, photo_url, id]
    );
    res.json({ message: "Property updated" });
  } catch (err) {
    console.error("updateMyProperty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMyProperty = async (req, res) => {
  try {
    const ownerId = req.session.user?.id;
    if (!ownerId || req.session.user?.role !== "owner") {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { id } = req.params;
    const [check] = await db.query(`SELECT id FROM properties WHERE id = ? AND owner_id = ?`, [id, ownerId]);
    if (check.length === 0) return res.status(403).json({ message: "You don't own this property" });

    await db.query(`DELETE FROM properties WHERE id = ?`, [id]);
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("deleteMyProperty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getProperties = async (req, res) => {
  try {
    const properties = await getAllProperties();
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchProperties = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    const properties = await filterProperties(location, startDate, endDate);
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProperty = async (req, res) => {  
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    
    const nextAvailableDate = await getNextAvailableDate(req.params.id);
    property.next_available_date = nextAvailableDate;
    
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProperty = async (req, res) => {
  try {
    const { title, description, type, location, price, owner_id } = req.body;
    const newId = await createProperty({
      title,
      description,
      type,
      location,
      price,
      owner_id,
    });
    res.status(201).json({ message: "Property created", propertyId: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
