const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Route/UserRoutes");
const connectDB = require("./Connection/connection");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = 5600;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});