import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";


import {
  assignUserToSubTeam,
  listUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  updateUserRole,
  deleteUser
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

// Admin ONLY Middleware guard for below routes
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

router.get("/users/pending", authenticate, checkAdmin, getPendingUsers);
router.patch("/users/:id/approve", authenticate, checkAdmin, approveUser);
router.delete("/users/:id/reject", authenticate, checkAdmin, rejectUser);

// Admin general user management
router.patch("/users/:id/role", authenticate, checkAdmin, updateUserRole);
router.delete("/users/:id", authenticate, checkAdmin, deleteUser);

// PATCH /users/:id/subteam
router.patch("/users/:id/subteam", authenticate, assignUserToSubTeam);

// GET /users
router.get("/users", authenticate, listUsers);

export default router;
