import db from "../config/db.js";


// Permission enum (FROZEN)
const PERMISSIONS = {
  CREATE_EXPERIMENT: "CREATE_EXPERIMENT",
  ADD_EXPERIMENT_LOG: "ADD_EXPERIMENT_LOG",
  UPLOAD_ATTACHMENT: "UPLOAD_ATTACHMENT",
};

// Permission matrix (FROZEN MVP)
const ROLE_PERMISSIONS = {
  PROJECT_LEAD: [
    PERMISSIONS.CREATE_EXPERIMENT,
    PERMISSIONS.ADD_EXPERIMENT_LOG,
    PERMISSIONS.UPLOAD_ATTACHMENT,
  ],
  CONTRIBUTOR: [
    PERMISSIONS.CREATE_EXPERIMENT,
    PERMISSIONS.ADD_EXPERIMENT_LOG,
    PERMISSIONS.UPLOAD_ATTACHMENT,
  ],
  VIEWER: [],
};


const resolveProjectRole = async (userId, project) => {
  // Project Lead check (ownership beats everything)
  if (project.project_lead_id === userId) {
    return "PROJECT_LEAD";
  }

  // Load user org context
  const userResult = await db.query(
    "SELECT team_id, subteam_id FROM users WHERE id = $1",
    [userId]
  );

  if (userResult.rows.length === 0) {
    return "VIEWER";
  }

  const user = userResult.rows[0];

  // Contributor rules
  const sameTeam = user.team_id === project.team_id;
  const sameSubteam =
    project.subteam_id === null ||
    user.subteam_id === project.subteam_id;

  if (sameTeam && sameSubteam) {
    return "CONTRIBUTOR";
  }

  // Everyone else
  return "VIEWER";
};



// src/middleware/rbac.middleware.js

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      let projectId;

      // Case 1: module → project
      if (req.params.moduleId) {
        const modResult = await db.query(
          "SELECT project_id FROM modules WHERE id = $1",
          [req.params.moduleId]
        );
        projectId = modResult.rows[0]?.project_id;
      }

      // Case 2: experiment → module → project
      if (req.params.experimentId) {
        const expResult = await db.query(
          `SELECT m.project_id
           FROM experiments e
           JOIN modules m ON e.module_id = m.id
           WHERE e.id = $1`,
          [req.params.experimentId]
        );
        projectId = expResult.rows[0]?.project_id;
      }

      // Case 3: log → experiment → module → project
      if (req.params.logId) {
        const logResult = await db.query(
          `SELECT m.project_id
           FROM experiment_logs l
           JOIN experiments e ON l.experiment_id = e.id
           JOIN modules m ON e.module_id = m.id
           WHERE l.id = $1`,
          [req.params.logId]
        );
        projectId = logResult.rows[0]?.project_id;
      }

      if (!projectId) {
        return res.status(400).json({
          message: "Project context not found",
        });
      }

      // Load project
      const projectResult = await db.query(
        "SELECT * FROM projects WHERE id = $1",
        [projectId]
      );

      const project = projectResult.rows[0];

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Move to next step (role resolution comes next)
      req.project = project;

        // Resolve role for this project
    const role = await resolveProjectRole(req.user.userId, project);
    req.projectRole = role;

    // Check permission
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];

    if (!allowedPermissions.includes(requiredPermission)) {
    return res.status(403).json({
        message: "You do not have permission to perform this action",
    });
    }

    // Authorized
    next();

    } catch (err) {
      console.error("RBAC error:", err);
      return res.status(500).json({
        message: "RBAC failure",
      });
    }
  };
};

