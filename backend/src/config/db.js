import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

const query = (text, params) => {
  return pool.query(text, params);
};

// ✅ default export (unchanged contract)
export default {
  pool,
  query,
};
