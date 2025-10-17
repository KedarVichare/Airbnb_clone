const {
  createProperty,
  getAllProperties,
  filterProperties,
  getPropertyById,
} = require("../models/propertymodel");

// Get all properties
exports.getProperties = async (req, res) => {   // ✅ plural
  try {
    const properties = await getAllProperties();
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Filter properties
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

// Get property details
exports.getProperty = async (req, res) => {     // ✅ singular
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add property
exports.addProperty = async (req, res) => {
  try {
    const { title, description, location, price, owner_id } = req.body;
    const newId = await createProperty({
      title,
      description,
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
