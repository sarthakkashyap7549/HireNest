import { findPublicUserById, updateUserProfile } from "../services/userService.js";
import { validateProfile } from "../utils/validators.js";

export async function getMe(req, res) {
  const user = await findPublicUserById(req.user.userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ user });
}

export async function updateMe(req, res) {
  validateProfile(req.body);
  const user = await updateUserProfile(req.user.userId, req.body);
  res.status(200).json({ user });
}
