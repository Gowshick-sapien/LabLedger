const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

async function run() {
  const users = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `);
  console.log("USERS:", users.rows);

  const subteams = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'subteams';
  `);
  console.log("SUBTEAMS:", subteams.rows);
  
  process.exit();
}
run();
