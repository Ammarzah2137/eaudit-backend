const express = require("express");
const router = express.Router();
const db = require("../db");


// ✅ Tax Report Summary
router.get("/tax/:uid", (req, res) => {
  const uid = req.params.uid;

  db.query(
    "SELECT SUM(CASE WHEN type='Income' THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type='Expense' THEN amount ELSE 0 END) AS expenses FROM transactions WHERE firebase_uid=?",
    [uid],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const income = results[0].income || 0;
      const expenses = results[0].expenses || 0;
      const tax = (income - expenses) * 0.05;

      res.json({
        total_income: income,
        total_expenses: expenses,
        tax_liability: tax,
      });
    }
  );
});

module.exports = router;
