/**
 * db.js — MongoDB connection via Mongoose
 *
 * The app currently serves pre-computed JSON (no DB needed to run).
 * Call connectDB() in index.js to switch to live MongoDB queries.
 */

const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/truthpulse";

  try {
    await mongoose.connect(uri, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(`  ✓ MongoDB connected → ${uri.replace(/\/\/.*@/, "//***@")}`);
  } catch (err) {
    console.error("  ✗ MongoDB connection failed:", err.message);
    console.log("  → Running without DB (JSON fallback active)");
  }
}

module.exports = connectDB;
