import db from "../config/db.js";

async function approveAdmin() {
  try {
    const result = await db.query(
      `UPDATE users SET status = 'approved' WHERE email = 'admin@lab.com' RETURNING *`
    );
    console.log("✅ Admin set to approved:", result.rows[0].email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to approve admin:", error);
    process.exit(1);
  }
}

approveAdmin();
