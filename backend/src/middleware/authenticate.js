import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token is required." });
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) return res.status(401).json({ message: "Authentication token is required." });
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}
