const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "saliha123",
  database: "e_audit_system",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed ❌", err);
  } else {
    console.log("MySQL Connected Successfully ✅");
  }
});

module.exports = db;
