// ================================
// E-Audit System Backend Server
// Node.js + Express + MySQL + AI + Blockchain
// ================================

// Import Packages
const express = require("express");
const cors = require("cors");

// Import Blockchain
const { myBlockchain } = require("./ai-service/blockchain");

// Import Routes
const transactionRoutes = require("./routes/transactions");
const fraudRoutes = require("./routes/fraud");
const reportRoutes = require("./routes/reports");

// Create Express App
const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// Test Route (Homepage)
// ================================
app.get("/", (req, res) => {
  res.send("✅ E-Audit Backend is Running Successfully!");
});

// ================================
// 🔗 Blockchain Route
// ================================
app.get("/blockchain", (req, res) => {
  res.json(myBlockchain.getChain());
});

// ================================
// API Routes
// ================================
app.use("/api/transactions", transactionRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/reports", reportRoutes);

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).send("Something broke!");
});

// ================================
// Start Server
// ================================
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server Running at:");
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 http://192.168.1.6:${PORT}`);
});