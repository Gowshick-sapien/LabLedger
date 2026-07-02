import express from "express";
import { createTeam, getTeam } from "../controllers/team.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

// Create team (run once)
router.post("/team", authenticate, createTeam);

// Get team info
router.get("/team", authenticate, getTeam);

export default router;
