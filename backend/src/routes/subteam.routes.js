import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createSubTeam, listSubTeams, deleteSubTeam } from "../controllers/subteam.controller.js";

const router = express.Router();

const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

router.get("/subteams", authenticate, listSubTeams);
router.post("/subteams", authenticate, checkAdmin, createSubTeam);
router.delete("/subteams/:id", authenticate, checkAdmin, deleteSubTeam);

export default router;
