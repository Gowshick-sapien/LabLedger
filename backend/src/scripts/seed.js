require("dotenv").config();
const db = require("../config/db");

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // ---- Insert Team ----
    const teamResult = await db.query(
      `INSERT INTO teams (name, domain, description)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [
        "IGNITION",
        "Rocketry",
        "Student rocketry and aerospace engineering team",
      ]
    );

    const teamId = teamResult.rows[0].id;

    // ---- Insert Users ----
    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12)`,
      [
        "Team Lead",
        "lead@ignition.org",
        "password123",
        "team_lead",

        "Contributor",
        "contributor@ignition.org",
        "password123",
        "contributor",

        "Viewer",
        "viewer@ignition.org",
        "password123",
        "viewer",
      ]
    );

    console.log("✅ Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
