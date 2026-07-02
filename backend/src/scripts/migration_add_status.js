import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config({ path: "../../.env" });

async function runMigration() {
  try {
    console.log("🚀 Starting database migration: adding 'status' to users table...");

    // 1. Add column if it doesn't exist
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
    `);

    // 2. Backfill existing users so they aren't locked out
    await db.query(`
      UPDATE users 
      SET status = 'approved' 
      WHERE status = 'pending';
    `);

    console.log("✅ Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
