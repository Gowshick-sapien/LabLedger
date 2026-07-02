import db from "../config/db.js";

// POST /team — create the single team
export const createTeam = async (req, res) => {
  try {
    const { name, domain, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    // Check if team already exists
    const existing = await db.query("SELECT id FROM teams");

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Team already exists" });
    }

    const result = await db.query(
      `
      INSERT INTO teams (name, domain, description)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, domain || null, description || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create team error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /team — fetch the single team
export const getTeam = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM teams LIMIT 1");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Team not created yet" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get team error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
