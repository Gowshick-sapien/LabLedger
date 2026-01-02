import express from "express";
import { createSubTeam, getSubTeams } from "../controllers/subteam.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create subteam
router.post("/subteams", authMiddleware, createSubTeam);

// List subteams
router.get("/subteams", authMiddleware, getSubTeams);

export default router;
