import express from "express";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  uploadAttachment,
  getAttachment
} from "../controllers/attachment.controller.js";

const router = express.Router();

router.post(
  "/logs/:logId/attachment",
  authMiddleware,
  upload.single("file"),
  uploadAttachment
);

router.get(
  "/logs/:logId/attachment",
  authMiddleware,
  getAttachment
);

export default router;
