import { hashPassword, comparePassword } from "../services/password.service.js";
import { signToken } from "../services/jwt.service.js";
import db from "../config/db.js"; // adjust if your db path differs

// =======================
// POST /auth/register
// =======================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);

    await db.query(
      `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      `,
      [name, email, hashedPassword, role || "contributor"]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =======================
// POST /auth/login
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await db.query(
      `
      SELECT id, password_hash, role, team_id, subteam_id
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔑 JWT PAYLOAD (TEMP, NOT STORED)
    const payload = {
      userId: user.id,
      role: user.role,
      team_id: user.team_id,
      subteam_id: user.subteam_id,
    };

    const token = signToken(payload);

    return res.status(200).json({ token });
 } catch (error) {
  console.error("Login error:", error);
  return res.status(500).json({ message: "Internal server error" });
}
};

// =======================
// GET /auth/me
// =======================
export const me = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      `
      SELECT id, name, email, role, team_id, subteam_id
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

