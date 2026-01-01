import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

const query = (text, params) => {
  return pool.query(text, params);
};

// ✅ default export (important)
export default {
  pool,
  query,
};
