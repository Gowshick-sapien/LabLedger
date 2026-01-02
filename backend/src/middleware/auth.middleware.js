import { verifyToken } from "../services/jwt.service.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach decoded payload to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;