import express from "express";
import { createSubTeam, getSubTeams } from "../controllers/subteam.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

// Create subteam
router.post("/subteams", authenticate, createSubTeam);

// List subteams
router.get("/subteams", authenticate, getSubTeams);

export default router;
