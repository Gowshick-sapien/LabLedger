import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";


import {
  assignUserToSubTeam,
  listUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

// GET /me
router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    userId: req.user.userId,
    role: req.user.role,
    teamId: req.user.teamId,
    subteamId: req.user.subteamId,
  });
});

// PATCH /users/:id/subteam
router.patch("/users/:id/subteam", authenticate, assignUserToSubTeam);

// GET /users
router.get("/users", authenticate, listUsers);

export default router;
