const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const edaRoutes = require("./routes/eda");
const connectDB = require("./db");

const app  = express();
const PORT = process.env.PORT || 5000;

// Optional MongoDB (app runs fine on JSON fallback without it)
connectDB();

app.use(cors());
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────
app.use("/api/eda", edaRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TruthPulse API running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ── Production: serve React build ──────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`\n  TruthPulse API → http://localhost:${PORT}\n`);
});
