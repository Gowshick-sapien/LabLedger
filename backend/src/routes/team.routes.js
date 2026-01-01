import express from "express";
import { createTeam, getTeam } from "../controllers/team.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create team (run once)
router.post("/team", authMiddleware, createTeam);

// Get team info
router.get("/team", authMiddleware, getTeam);

export default router;
