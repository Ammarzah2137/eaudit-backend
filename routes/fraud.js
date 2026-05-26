const express = require("express");
const router = express.Router();
const db = require("../db");


// ✅ Fraud Check (Simple Rule Based)
router.post("/check", (req, res) => {
  const { firebase_uid, transaction_id, amount } = req.body;

  let risk = "Low";
  let description = "Normal Transaction";

  if (amount > 10000) {
    risk = "High";
    description = "Unusual High Amount Detected";
  }

  if (amount > 50000) {
    risk = "Critical";
    description = "Extremely Suspicious Amount!";
  }

  if (risk !== "Low") {
    db.query(
      "INSERT INTO fraud_alerts (firebase_uid, transaction_id, alert_type, risk_level, description) VALUES (?, ?, ?, ?, ?)",
      [firebase_uid, transaction_id, "Anomaly", risk, description]
    );
  }

  res.json({
    fraud: risk !== "Low",
    risk_level: risk,
    description: description,
  });
});


// ✅ Get Fraud Alerts
router.get("/alerts/:uid", (req, res) => {
  const uid = req.params.uid;

  db.query(
    "SELECT * FROM fraud_alerts WHERE firebase_uid=? ORDER BY created_at DESC",
    [uid],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;
