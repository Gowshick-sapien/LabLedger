import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

async function runMigration() {
  try {
    console.log("🚀 Starting database migration: adding 'lead_id' to subteams table...");

    // 1. Add column if it doesn't exist
    await db.query(`
      ALTER TABLE subteams 
      ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);

    // 2. Backfill existing subteams with an admin's id
    const adminRes = await db.query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`);
    if(adminRes.rows.length > 0) {
      const adminId = adminRes.rows[0].id;
      await db.query(`
        UPDATE subteams 
        SET lead_id = $1 
        WHERE lead_id IS NULL;
      `, [adminId]);
    } else {
        console.log("⚠️ No admin found to backfill existing subteams. Run manual fix if necessary.");
    }

    console.log("✅ Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
