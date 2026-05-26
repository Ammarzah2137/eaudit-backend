const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");

// 🔗 Blockchain
const { Block, myBlockchain } = require("../ai-service/blockchain");

// =======================================
// ✅ GET All Transactions for a User
// =======================================
router.get("/:firebase_uid", (req, res) => {
  const { firebase_uid } = req.params;

  db.query(
    "SELECT * FROM transactions WHERE firebase_uid = ? ORDER BY id DESC",
    [firebase_uid],
    (err, results) => {
      if (err) {
        console.error("Fetch Transactions Error:", err);
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
});

// =======================================
// ✅ Add Transaction + AI + Blockchain
// =======================================
router.post("/add", (req, res) => {
  const { firebase_uid, type, category, amount } = req.body;

  if (!firebase_uid || !type || !category || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Ensure user exists
  db.query(
    "INSERT IGNORE INTO users (firebase_uid) VALUES (?)",
    [firebase_uid]
  );

  // Insert transaction
  db.query(
    "INSERT INTO transactions (firebase_uid, type, category, amount) VALUES (?, ?, ?, ?)",
    [firebase_uid, type, category, amount],
    async (err, result) => {
      if (err) {
        console.error("Transaction Insert Error:", err);
        return res.status(500).json(err);
      }

      const transactionId = result.insertId;

      // ================================
      // 🔗 BLOCKCHAIN PART (SAFE)
      // ================================
      try {
        const blockData = {
          transaction_id: transactionId,
          firebase_uid,
          type,
          category,
          amount
        };

        const newBlock = new Block(
          myBlockchain.chain.length,
          new Date().toISOString(),
          blockData
        );

        myBlockchain.addBlock(newBlock);

        console.log("🧱 New Block Added:", newBlock);

      } catch (blockError) {
        console.error("Blockchain Error:", blockError);
      }

      // ================================
      // 🤖 AI PART
      // ================================
      try {
        const aiResponse = await axios.post(
          "http://192.168.1.6:5001/detect", // ⚠️ make sure this matches your PC IP
          { amount: amount }
        );

        const suspicious = aiResponse.data.suspicious;
        const fraudAlert = aiResponse.data.fraud_alert;

        let alertType = null;
        let riskLevel = null;
        let description = null;

        if (suspicious === 1 && fraudAlert === 1) {
          alertType = "Confirmed Fraud";
          riskLevel = "Critical";
          description = "Detected by both AI models.";
        } else if (fraudAlert === 1) {
          alertType = "Fraud Prediction";
          riskLevel = "High";
          description = "Random Forest detected fraud.";
        } else if (suspicious === 1) {
          alertType = "Suspicious Activity";
          riskLevel = "Medium";
          description = "Isolation Forest detected anomaly.";
        }

        // Insert fraud alert if needed
        if (alertType !== null) {
          db.query(
            `INSERT INTO fraud_alerts 
            (firebase_uid, transaction_id, alert_type, risk_level, description)
            VALUES (?, ?, ?, ?, ?)`,
            [firebase_uid, transactionId, alertType, riskLevel, description],
            (err) => {
              if (err) {
                console.error("Fraud Alert Insert Error:", err);
              }
            }
          );
        }

        // Final Response
        res.json({
          message: "Transaction Added Successfully ✅",
          transaction_id: transactionId,
          suspicious,
          fraudAlert
        });

      } catch (aiError) {
        console.error("AI Error:", aiError.message);

        // Even if AI fails, transaction still succeeds
        res.json({
          message: "Transaction Added (AI Failed ⚠️)",
          transaction_id: transactionId
        });
      }
    }
  );
});

module.exports = router;