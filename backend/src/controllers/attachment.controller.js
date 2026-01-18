import db from "../config/db.js";
import { uploadFile } from "../services/storage.service.js";

// ✅ RENAMED EXPORT (THIS FIXES THE CRASH)
export const uploadLogAttachment = async (req, res) => {
  try {
    const { logId } = req.params;

    // 1️⃣ file presence
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // 2️⃣ log exists?
    const logCheck = await db.query(
      "SELECT id FROM experiment_logs WHERE id = $1",
      [logId]
    );

    if (logCheck.rows.length === 0) {
      return res.status(404).json({ message: "Experiment log not found" });
    }

    // 3️⃣ attachment already exists?
    const existing = await db.query(
      "SELECT id FROM attachments WHERE log_id = $1",
      [logId]
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Attachment already exists for this log" });
    }

    // 4️⃣ upload to cloud
    const url = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // 5️⃣ save metadata
    const result = await db.query(
      `INSERT INTO attachments (log_id, file_name, file_type, storage_url)
       VALUES ($1, $2, $3, $4)
       RETURNING file_name, file_type, storage_url`,
      [logId, req.file.originalname, req.file.mimetype, url]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to upload attachment" });
  }
};

export const getAttachment = async (req, res) => {
  try {
    const { logId } = req.params;

    const result = await db.query(
      "SELECT file_name, file_type, storage_url FROM attachments WHERE log_id = $1",
      [logId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No attachment found" });
    }

    return res.json({
      fileName: result.rows[0].file_name,
      fileType: result.rows[0].file_type,
      url: result.rows[0].storage_url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch attachment" });
  }
};
