import { pool } from "../db/pool.js";

const userFields = `
  id, full_name AS fullName, email, phone, role, location, headline,
  skills, about, created_at AS createdAt, updated_at AS updatedAt`;

function parseSkills(value) {
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value || "[]"); } catch { return []; }
}

function mapUser(row) {
  if (!row) return null;
  return { ...row, skills: parseSkills(row.skills) };
}

export async function findPublicUserById(id) {
  const [rows] = await pool.execute(`SELECT ${userFields} FROM users WHERE id = ?`, [id]);
  return mapUser(rows[0]);
}

export async function findUserByEmailWithPassword(email) {
  const [rows] = await pool.execute(
    `SELECT ${userFields}, password_hash AS passwordHash FROM users WHERE email = ?`,
    [email]
  );
  return mapUser(rows[0]);
}

export async function createUser({ fullName, email, phone, role, passwordHash }) {
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, phone, role, password_hash) VALUES (?, ?, ?, ?, ?)`,
    [fullName, email, phone, role, passwordHash]
  );
  return findPublicUserById(result.insertId);
}

export async function updateUserProfile(id, profile) {
  const skills = profile.skills.map((skill) => skill.trim()).filter(Boolean);
  await pool.execute(
    `UPDATE users
     SET full_name = ?, phone = ?, role = ?, location = ?, headline = ?, skills = ?, about = ?
     WHERE id = ?`,
    [profile.fullName.trim(), profile.phone.trim(), profile.role.trim(), profile.location?.trim() || "", profile.headline?.trim() || "", JSON.stringify(skills), profile.about?.trim() || "", id]
  );
  return findPublicUserById(id);
}
