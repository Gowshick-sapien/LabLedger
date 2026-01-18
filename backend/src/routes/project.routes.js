import express from "express";
import {
  createProject,
  listProjects,
  getProjectById
} from "../controllers/project.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProjectById);

export default router;
