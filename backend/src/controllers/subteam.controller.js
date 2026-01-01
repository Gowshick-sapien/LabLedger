import db from "../config/db.js";

// POST /subteams — create subteam
export const createSubTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "SubTeam name is required" });
    }

    // Ensure team exists (single-team assumption)
    const teamResult = await db.query("SELECT id FROM teams LIMIT 1");

    if (teamResult.rows.length === 0) {
      return res.status(400).json({ message: "Team must exist before creating subteams" });
    }

    const teamId = teamResult.rows[0].id;

    const result = await db.query(
      `
      INSERT INTO subteams (name, description, team_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, description || null, teamId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create subteam error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /subteams — list all subteams
export const getSubTeams = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, description, team_id
      FROM subteams
      ORDER BY name
      `
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get subteams error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
