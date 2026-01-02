import express from "express";
import {
  createProject,
  listProjects,
  getProjectById
} from "../controllers/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProjectById);

export default router;
