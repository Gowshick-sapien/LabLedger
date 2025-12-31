const express = require("express");
const cors = require("cors");

const app = express();

// ---------- Global Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------
const healthRoutes = require("./routes/health.routes");
const dbTestRoutes = require("./routes/dbTest.routes");

app.use("/health", healthRoutes);
app.use("/db-test", dbTestRoutes);


// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error"
  });
});

module.exports = app;
