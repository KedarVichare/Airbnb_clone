const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

// CORS (allow React frontend to talk to backend)
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    credentials: true,               // allow cookies/sessions
  })
);

// DB (if you want to test db connection here, uncomment this)
const db = require("./src/config/db");

// Routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const propertyRoutes = require("./src/routes/propertyRoutes");
app.use("/api/properties", propertyRoutes);

const bookingRoutes = require("./src/routes/bookingroutes");
app.use("/api/bookings", bookingRoutes);

const userRoutes = require("./src/routes/userRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running properly");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
