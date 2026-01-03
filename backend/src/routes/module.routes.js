import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createModule,
  listModules
} from "../controllers/module.controller.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", createModule);
router.get("/", listModules);

export default router;
