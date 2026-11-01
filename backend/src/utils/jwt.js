import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createToken(user) {
  // Keep authentication claims small and never include credential material.
  return jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
