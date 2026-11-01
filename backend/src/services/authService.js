import bcrypt from "bcryptjs";
import { createUser, findUserByEmailWithPassword } from "./userService.js";

const SALT_ROUNDS = 12;

export async function registerUser({ fullName, email, phone, role, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmailWithPassword(normalizedEmail);
  if (existing) {
    const error = new Error("An account with this email already exists. Try logging in.");
    error.status = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    return await createUser({ fullName: fullName.trim(), email: normalizedEmail, phone: phone.trim(), role: role.trim(), passwordHash });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      error.status = 409;
      error.message = "An account with this email already exists. Try logging in.";
    }
    throw error;
  }
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmailWithPassword(email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error("Email or password is incorrect.");
    error.status = 401;
    throw error;
  }
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
