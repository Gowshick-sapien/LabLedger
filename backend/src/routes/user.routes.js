import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    userId: req.user.userId,
    role: req.user.role,
    teamId: req.user.teamId,
    subteamId: req.user.subteamId,
  });
});

export default router;
