import db from "../config/db.js";

async function run() {
  try {
    const defaultTeam = await db.query("SELECT id FROM teams LIMIT 1");
    const defaultSubteam = await db.query("SELECT id FROM subteams LIMIT 1");
    const defaultUser = await db.query("SELECT id FROM users LIMIT 1");

    if (!defaultTeam.rows.length || !defaultSubteam.rows.length || !defaultUser.rows.length) {
       console.log("Missing prerequisites (team, subteam, user) in DB.");
       return process.exit(1);
    }
    
    console.log("Team:", defaultTeam.rows[0].id, "Sub:", defaultSubteam.rows[0].id, "User:", defaultUser.rows[0].id);

    const result = await db.query(
      `INSERT INTO projects 
       (name, description, project_type, team_id, subteam_id, project_lead_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      ["A cool test", "description", "SUBTEAM", defaultTeam.rows[0].id, defaultSubteam.rows[0].id, defaultUser.rows[0].id]
    );

    console.log("SUCCESS:", result.rows[0]);
  } catch (err) {
    console.error("SQL ERROR:", err.message);
  } finally {
    process.exit(0);
  }
}
run();
