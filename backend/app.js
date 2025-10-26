// backend/app.js
const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// ✅ Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (allow React frontend to talk to backend)
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend port
    credentials: true, // allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Sessions (must come AFTER cors)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // must be false for local dev (true only for HTTPS)
      sameSite: "lax", // allows sharing cookies across localhost ports
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// ✅ Database connection
const db = require("./src/config/db");

// ✅ Routes
const authRoutes = require("./src/routes/authRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const bookingRoutes = require("./src/routes/bookingroutes");
const userRoutes = require("./src/routes/userRoutes");
const favouritesRoutes = require("./src/routes/favouritesRoutes");

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favourites", favouritesRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running properly 🚀");
});

// ✅ Serve uploads folder if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

module.exports = app;
