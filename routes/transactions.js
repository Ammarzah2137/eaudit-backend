const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Add Transaction
router.post("/add", (req, res) => {
  const { firebase_uid, type, category, amount } = req.body;

  db.query(
    "INSERT IGNORE INTO users (firebase_uid) VALUES (?)",
    [firebase_uid]
  );

  db.query(
    "INSERT INTO transactions (firebase_uid, type, category, amount) VALUES (?, ?, ?, ?)",
    [firebase_uid, type, category, amount],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Transaction Added Successfully ✅",
        transaction_id: result.insertId,
      });
    }
  );
});

// ✅ Get All Transactions
router.get("/user/:uid", (req, res) => {
  const uid = req.params.uid;

  db.query(
    "SELECT * FROM transactions WHERE firebase_uid=?",
    [uid],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;
