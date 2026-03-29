require("dotenv").config({ path: "../../.env" });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    const r = await pool.query("UPDATE users SET role = 'viewer' WHERE email = 'contributor@ignition.org' RETURNING *");
    console.log(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
