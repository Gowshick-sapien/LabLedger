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
      `
      UPDATE users
      SET subteam_id = $1,
          team_id = (
            SELECT team_id
            FROM subteams
            WHERE id = $1
          )
      WHERE id = $2
      `,
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
        s.name AS subteam_name,
        u.status
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

export const getPendingUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, email, created_at, role, status
      FROM users
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get pending users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const defaultTeam = await db.query("SELECT id FROM teams LIMIT 1");
    const teamId = defaultTeam.rows.length > 0 ? defaultTeam.rows[0].id : null;

    const result = await db.query(`
      UPDATE users
      SET status = 'approved', role = $1, team_id = $2
      WHERE id = $3
      RETURNING id, name, email, role, status
    `, [role || 'contributor', teamId, userId]);

    if(result.rows.length === 0){
      return res.status(404).json({ message: "User not found or already approved" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Approve user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await db.query(`
      DELETE FROM users WHERE id = $1 AND status = 'pending' RETURNING id
    `, [userId]);
    
    if(result.rows.length === 0){
      return res.status(404).json({ message: "User not found or already processed" });
    }
    
    return res.status(200).json({ message: "User rejected and deleted successfully" });
  } catch (error) {
    console.error("Reject user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    let query = `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, status, subteam_id`;
    if (role === 'viewer') {
      query = `UPDATE users SET role = $1, subteam_id = NULL WHERE id = $2 RETURNING id, name, email, role, status, subteam_id`;
    }

    const result = await db.query(query, [role, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update user role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.userId;

    // Shift ownership of any projects owned by the user to the admin
    await db.query(
      "UPDATE projects SET project_lead_id = $1 WHERE project_lead_id = $2",
      [adminId, userId]
    );

    // Shift ownership of any experiments created by the user to the admin
    await db.query(
      "UPDATE experiments SET created_by = $1 WHERE created_by = $2",
      [adminId, userId]
    );

    // Hard delete the user
    const result = await db.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message || error);
    if (error.code === "23503") {
      return res.status(400).json({ message: "Cannot delete user right now. They might own active projects or resources." });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
