import { authorize } from "../middleware/rbac.middleware.js";
import express from "express";
import {
  createExperiment,
  listExperimentsByModule,
  getExperimentById
} from "../controllers/experiment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// POST /modules/:moduleId/experiments
router.post(
  "/modules/:moduleId/experiments",
  authorize("CREATE_EXPERIMENT"),
  createExperiment
);


// GET /modules/:moduleId/experiments
router.get("/modules/:moduleId/experiments", listExperimentsByModule);

// GET /experiments/:experimentId
router.get("/experiments/:experimentId", getExperimentById);

export default router;
