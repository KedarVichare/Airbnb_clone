const { createUser, findUserByEmail } = require("../models/usermodels");
const bcrypt = require("bcryptjs");

// ----------------- Signup -----------------
const signup = async (req, res) => {
  const { name, email, password, role, location } = req.body;
  console.log("Incoming signup request:", req.originalUrl);
  console.log("Request body:", req.body);

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      location: role === "owner" ? location : null,
    });

    res.status(201).json({ message: "User registered", userId });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- Login -----------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------- Logout -----------------
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err.message);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};

// ----------------- Check Session -----------------
const checkSession = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
};

module.exports = { signup, login, logout, checkSession };
