import db from '../config/db.js';

async function run() {
  const payload = {
    name: "Terminal Admin",
    email: "terminaladmin@lab.com",
    password: "password123",
    role: "admin"
  };

  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      console.log("✅ Successfully executed API Registration (created as pending).");
      
      const updateResult = await db.query(`
        UPDATE users SET status = 'approved' WHERE email = $1 RETURNING *
      `, [payload.email]);
      
      if (updateResult.rows.length > 0) {
        console.log(`✅ Registration for ${payload.email} has been automatically approved!`);
      }
    } else {
      console.error("Failed API req:", await res.text());
    }
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    process.exit(0);
  }
}
run();
