import db from "../config/db.js";

// PATCH /users/:id/subteam
export const assignUserToSubTeam = async (req, res) => {
  try {
    const userId = req.params.id;
    const { subteamId } = req.body;

    // Validate user exists
    const userResult = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // If subteamId is provided, validate it exists
    if (subteamId !== null) {
      const subteamResult = await db.query(
        "SELECT id FROM subteams WHERE id = $1",
        [subteamId]
      );

      if (subteamResult.rows.length === 0) {
        return res.status(404).json({ message: "SubTeam not found" });
      }
    }

    // Update user's subteam
    await db.query(
      "UPDATE users SET subteam_id = $1 WHERE id = $2",
      [subteamId, userId]
    );

    return res.status(200).json({
      message: "User subteam updated successfully",
    });
  } catch (error) {
    console.error("Assign subteam error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /users — internal listing
export const listUsers = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.team_id,
        t.name AS team_name,
        u.subteam_id,
        s.name AS subteam_name
      FROM users u
      LEFT JOIN teams t ON u.team_id = t.id
      LEFT JOIN subteams s ON u.subteam_id = s.id
      ORDER BY u.id
      `
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
