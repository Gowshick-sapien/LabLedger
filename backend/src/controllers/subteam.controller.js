import db from "../config/db.js";

export const createSubTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const teamResult = await db.query("SELECT id FROM teams LIMIT 1");
    const teamId = teamResult.rows.length > 0 ? teamResult.rows[0].id : null;

    const adminId = req.user.userId;
    const result = await db.query(
      "INSERT INTO subteams (name, description, team_id, lead_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, teamId, adminId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create subteam error:", err);
    res.status(500).json({ message: "Failed to create subteam" });
  }
};

export const listSubTeams = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.id, s.name, s.description, s.lead_id,
        COALESCE(
          (SELECT json_agg(p) FROM projects p WHERE p.subteam_id = s.id), 
          '[]'
        ) as projects,
        COALESCE(
          (SELECT json_agg(
             json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'role', u.role)
           ) FROM users u WHERE u.subteam_id = s.id), 
          '[]'
        ) as members
      FROM subteams s
      ORDER BY s.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("List subteams error:", err);
    res.status(500).json({ message: "Failed to fetch subteams" });
  }
};

export const deleteSubTeam = async (req, res) => {
  try {
    const subteamId = req.params.id;
    const { reason } = req.body;
    const adminId = req.user.userId;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Reason for deletion must be explicitly provided." });
    }

    const result = await db.query(
      "DELETE FROM subteams WHERE id = $1 RETURNING id",
      [subteamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subteam not found" });
    }

    // Explicitly audit the reason
    await db.query(
      `INSERT INTO admin_audit_logs (admin_id, action, target_entity, target_id, reason)
       VALUES ($1, 'DELETE', 'subteams', $2, $3)`,
      [adminId, subteamId, reason.trim()]
    );

    res.json({ message: "Subteam deleted successfully" });
  } catch (err) {
    console.error("Delete subteam error:", err);
    if (err.code === "23503") { // foreign key violation
      return res.status(400).json({ message: "Cannot delete subteam. It still has projects or users actively assigned to it. Please reassign or clear them first." });
    }
    res.status(500).json({ message: "Failed to delete subteam" });
  }
};

export const assignSubTeamLead = async (req, res) => {
  try {
    const subteamId = req.params.id;
    const { lead_id } = req.body;

    // Validate the new lead
    const userResult = await db.query(
      "SELECT id, role, subteam_id FROM users WHERE id = $1",
      [lead_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Lead user not found" });
    }

    const leadUser = userResult.rows[0];

    // Must be admin or contributor
    if (leadUser.role === "viewer") {
      return res.status(400).json({ message: "A viewer cannot be a subteam lead" });
    }

    // Must be in the subteam OR an admin
    if (leadUser.role !== "admin" && leadUser.subteam_id !== parseInt(subteamId)) {
      return res.status(400).json({ message: "Lead must belong to this subteam" });
    }

    const result = await db.query(
      "UPDATE subteams SET lead_id = $1 WHERE id = $2 RETURNING *",
      [lead_id, subteamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subteam not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Assign subteam lead error:", err);
    res.status(500).json({ message: "Failed to assign subteam lead" });
  }
};
