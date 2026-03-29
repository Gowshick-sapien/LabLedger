import db from "../config/db.js";

async function checkUsers() {
  const result = await db.query("SELECT email, password_hash, status FROM users");
  console.log(result.rows);
  process.exit();
}
checkUsers();
