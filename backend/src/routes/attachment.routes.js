import express from "express";
import upload from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  uploadLogAttachment,
  getAttachment
} from "../controllers/attachment.controller.js";

const router = express.Router();

router.post(
  "/logs/:logId/attachment",
  authenticate,
  upload.single("file"),
  uploadLogAttachment
);

router.get(
  "/logs/:logId/attachment",
  authenticate,
  getAttachment
);

export default router;
