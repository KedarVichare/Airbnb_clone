const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax", 
      maxAge: 1000 * 60 * 60 * 2, 
    },
  })
);

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const bookingRoutes = require("./src/routes/bookingroutes");
const userRoutes = require("./src/routes/userRoutes");
const favouritesRoutes = require("./src/routes/favouritesRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favourites", favouritesRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running properly 🚀");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads", "profiles")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
