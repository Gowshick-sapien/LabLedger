import db from "../config/db.js";

/**
 * POST /modules/:moduleId/experiments
 */
export const createExperiment = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, objective } = req.body;
    const userId = req.user.userId;

    if (!title || !objective) {
      return res.status(400).json({ message: "Title and objective are required" });
    }

    // Validate module exists
    const moduleCheck = await db.query(
      "SELECT id FROM modules WHERE id = $1",
      [moduleId]
    );

    if (moduleCheck.rows.length === 0) {
      return res.status(404).json({ message: "Module not found" });
    }

    const result = await db.query(
      `INSERT INTO experiments (title, objective, module_id, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, objective, module_id, created_at`,
      [title, objective, moduleId, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create experiment" });
  }
};

/**
 * GET /modules/:moduleId/experiments
 */
export const listExperimentsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const result = await db.query(
      `SELECT id, title, objective, created_at
       FROM experiments
       WHERE module_id = $1
       ORDER BY created_at ASC`,
      [moduleId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch experiments" });
  }
};

/**
 * GET /experiments/:experimentId
 */
export const getExperimentById = async (req, res) => {
  try {
    const { experimentId } = req.params;

    const result = await db.query(
      `SELECT 
         e.id,
         e.title,
         e.objective,
         e.created_at,
         m.id AS module_id,
         m.name AS module_name,
         p.id AS project_id,
         p.name AS project_name
       FROM experiments e
       JOIN modules m ON e.module_id = m.id
       JOIN projects p ON m.project_id = p.id
       WHERE e.id = $1`,
      [experimentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch experiment details" });
  }
};
