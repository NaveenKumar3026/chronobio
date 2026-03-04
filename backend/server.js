const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const insightRoutes = require("./routes/insightRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MYSQL CONNECTION =================
// Use centralized DB connection from `db.js` (reads from environment variables)
const db = require("./db");

// Make db available to routes/controllers via app.get('db') if needed
app.set("db", db);

// ================= ROUTES =================
app.use("/api", authRoutes);
app.use("/api", logRoutes);
app.use("/api", insightRoutes);

// ================= DEFAULT ROUTE =================
app.get("/", (req, res) => {
  res.send("ChronoBio API Running 🧬");
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});