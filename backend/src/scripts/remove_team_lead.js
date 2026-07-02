import db from "../config/db.js";

async function run() {
  const result = await db.query("UPDATE users SET role = 'contributor' WHERE role = 'team_lead' RETURNING *");
  console.log(`Updated ${result.rows.length} users from 'team_lead' to 'contributor'`);
  process.exit(0);
}
run();
