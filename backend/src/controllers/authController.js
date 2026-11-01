import { authenticateUser, registerUser } from "../services/authService.js";
import { findPublicUserById } from "../services/userService.js";
import { createToken } from "../utils/jwt.js";
import { validateLogin, validateRegistration } from "../utils/validators.js";

export async function register(req, res) {
  validateRegistration(req.body);
  const user = await registerUser(req.body);
  res.status(201).json({ user, token: createToken(user) });
}

export async function login(req, res) {
  validateLogin(req.body);
  const user = await authenticateUser(req.body.email, req.body.password);
  res.status(200).json({ user, token: createToken(user) });
}

export async function me(req, res) {
  const user = await findPublicUserById(req.user.userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 401;
    throw error;
  }
  res.status(200).json({ user });
}
