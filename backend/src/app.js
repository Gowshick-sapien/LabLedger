import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import healthRoutes from "./routes/health.routes.js";
import dbTestRoutes from "./routes/dbTest.routes.js";

const app = express();

// ---------- Global Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------
app.use("/health", healthRoutes);
app.use("/db-test", dbTestRoutes);

// 👇 AUTH TEST ROUTE
app.use(userRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
