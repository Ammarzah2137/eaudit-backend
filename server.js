// ================================
//  E-Audit System Backend Server
//  Node.js + Express + MySQL
//  Production Ready for Render
// ================================

const express = require("express");
const cors = require("cors");

// Import Routes
const transactionRoutes = require("./routes/transactions");
const fraudRoutes = require("./routes/fraud");
const reportRoutes = require("./routes/reports");

// Create Express App
const app = express();

// ================================
// Middleware
// ================================

// Allow all origins (you can restrict later)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ================================
// Health Check Route
// ================================

app.get("/", (req, res) => {
  res.status(200).send("✅ E-Audit Backend is Running on Render!");
});

// ================================
// API Routes
// ================================

app.use("/api/transactions", transactionRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/reports", reportRoutes);

// ================================
// Handle Unknown Routes
// ================================

app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ================================
// Global Error Handler
// ================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ================================
// Start Server (Render Compatible)
// ================================

// VERY IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
