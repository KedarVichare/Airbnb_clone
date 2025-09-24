// testdb.js
const mysql = require("mysql2");

// create a connection
const connection = mysql.createConnection({
  host: "localhost",   // or 127.0.0.1
  user: "root",        // your MySQL username
  password: "seekrit", // your MySQL password
  database: "airbnb_db"   // change to your database name
});

// connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL!");

  // optional: run a test query
  connection.query("SELECT NOW() AS currentTime", (err, results) => {
    if (err) {
      console.error("❌ Query error:", err.message);
    } else {
      console.log("📌 Current Time from DB:", results[0].currentTime);
    }

    // close connection
    connection.end();
  });
});
