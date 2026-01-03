import db from "../config/db.js";

// POST /projects/:projectId/modules
export const createModule = async (req, res) => {
  try {
    const { name } = req.body;
    const { projectId } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Module name required" });
    }

    // verify project exists
    const projectCheck = await db.query(
      "SELECT id FROM projects WHERE id = $1",
      [projectId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const result = await db.query(
      `
      INSERT INTO modules (name, project_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, projectId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE MODULE ERROR:", err.message);
    res.status(500).json({ message: "Failed to create module" });
  }
};

// GET /projects/:projectId/modules
export const listModules = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await db.query(
      `
      SELECT id, name
      FROM modules
      WHERE project_id = $1
      ORDER BY created_at ASC
      `,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("LIST MODULES ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};
