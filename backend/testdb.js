// testdb.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",         // your MySQL username
  password: "password", // your MySQL password
  database: "airbnb_clone" // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL successfully!");
    process.exit(0);
  }
});
