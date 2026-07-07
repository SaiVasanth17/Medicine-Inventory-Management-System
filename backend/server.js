const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/medicines", medicineRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Medicine Master API is Running...");
});

// Database Test
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database Connected Successfully",
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database Connection Failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});