import db from "../config/db.js";

async function approve() {
  await db.query(`UPDATE users SET status = 'approved', role = 'admin' WHERE email = 'admin@labledger.com'`);
  console.log("Approved admin@labledger.com");
  
  // also let's just create an explicit admin@lab.com just in case
  const bcrypt = await import('bcrypt');
  const hash = await bcrypt.hash('password123', 10);
  
  const existing = await db.query(`SELECT id FROM users WHERE email = 'admin@lab.com'`);
  if (existing.rows.length === 0) {
    await db.query(`INSERT INTO users (name, email, password_hash, role, status) VALUES ('Super Admin', 'admin@lab.com', $1, 'admin', 'approved')`, [hash]);
    console.log("Re-created admin@lab.com");
  } else {
    await db.query(`UPDATE users SET status = 'approved', role = 'admin', password_hash = $1 WHERE email = 'admin@lab.com'`, [hash]);
    console.log("Reset admin@lab.com");
  }
  process.exit();
}
approve();
