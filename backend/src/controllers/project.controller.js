import db from "../config/db.js";



export const createProject = async (req, res) => {
  try {
    const { name, description, subteamId } = req.body;
    const user = req.user; // from JWT
    const projectLeadId = req.body.projectLeadId || user.userId;

    if (!name || !subteamId || !projectLeadId) {
      return res.status(400).json({ message: "Missing required fields: name, subteamId, or projectLeadId" });
    }

    let teamId = user.team_id;

    if (!teamId) {
      const defaultTeam = await db.query("SELECT id FROM teams LIMIT 1");
      if (defaultTeam.rows.length === 0) {
        return res.status(400).json({ message: "No active team exists in the system to assign this project to." });
      }
      teamId = defaultTeam.rows[0].id;
    }

    const projectType = "SUBTEAM";
    const finalSubteamId = subteamId;

    const result = await db.query(
      `INSERT INTO projects 
       (name, description, project_type, team_id, subteam_id, project_lead_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, projectType, teamId, finalSubteamId, projectLeadId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
  console.error("CREATE PROJECT ERROR:", err.message);
  res.status(500).json({
    message: "Failed to create project",
    error: err.message
  });
}
};

export const listProjects = async (req, res) => {
  try {
    const user = req.user;

    const result = await db.query(
      `
      SELECT p.id, p.name, p.project_type, p.project_lead_id
      FROM projects p
      WHERE
        $3 = 'admin'
        OR p.project_lead_id = $4
        OR p.project_type = 'TEAM'
        OR (
          p.project_type = 'SUBTEAM'
          AND (
            p.subteam_id = $1
            OR $2 = true
          )
        )
      `,
      [user.subteam_id, user.is_team_lead || false, user.role, user.userId]
    );

    const projects = result.rows.map(p => ({
      id: p.id,
      name: p.name,
      projectType: p.project_type,
      userRole:
        p.project_lead_id === user.userId
          ? "Project Lead"
          : "Viewer"
    }));

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    const result = await db.query(
      `
      SELECT 
        p.*,
        u.name AS project_lead_name,
        s.name AS subteam_name
      FROM projects p
      JOIN users u ON u.id = p.project_lead_id
      LEFT JOIN subteams s ON s.id = p.subteam_id
      WHERE p.id = $1
      `,
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userRole = req.user.role;
    
    // Validate role is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Only admins can delete projects" });
    }

    const result = await db.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err.message);
    if (err.code === "23503") { // foreign key violation code in pg
      return res.status(400).json({ message: "Cannot delete project. Please manually clear all associated experiments and modules first if cascading is disabled." });
    }
    res.status(500).json({ message: "Failed to delete project" });
  }
};
