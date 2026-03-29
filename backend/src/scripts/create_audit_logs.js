import db from "../config/db.js";

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        action TEXT NOT NULL,
        target_entity TEXT NOT NULL,
        target_id INTEGER,
        reason TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Audit logs table created or exists");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
