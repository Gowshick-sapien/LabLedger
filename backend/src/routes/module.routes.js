import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createModule,
  listModules
} from "../controllers/module.controller.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.post("/", createModule);
router.get("/", listModules);

export default router;
