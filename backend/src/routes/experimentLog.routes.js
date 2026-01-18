import express from "express";
import {
  addExperimentLog,
  listExperimentLogs
} from "../controllers/experimentLog.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

// all log routes require auth
router.use(authenticate);

// POST /experiments/:experimentId/logs
router.post("/experiments/:experimentId/logs", addExperimentLog);

// GET /experiments/:experimentId/logs
router.get("/experiments/:experimentId/logs", listExperimentLogs);

// Explicitly block log mutation (immutability enforcement)

router.put("/logs/:id", (req, res) => {
  res.status(405).json({
    message: "Experiment logs are immutable"
  });
});

router.delete("/logs/:id", (req, res) => {
  res.status(405).json({
    message: "Experiment logs are immutable"
  });
});


export default router;
