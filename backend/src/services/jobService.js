import { pool } from "../db/pool.js";

const jobColumns = `
  id, title, company, location, type, mode, experience, salary,
  skills, posted_days_ago AS postedDaysAgo, description`;

function parseSkills(value) {
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value || "[]"); } catch { return []; }
}

export function mapJob(row) {
  if (!row) return null;
  return { ...row, salary: Number(row.salary), skills: parseSkills(row.skills) };
}

export async function listJobs(filters = {}) {
  const where = [];
  const values = [];
  if (filters.q) {
    const search = `%${filters.q.trim()}%`;
    where.push("(title LIKE ? OR company LIKE ? OR location LIKE ? OR JSON_SEARCH(skills, 'one', ?) IS NOT NULL)");
    values.push(search, search, search, search);
  }
  for (const field of ["location", "type", "mode", "experience"]) {
    if (filters[field]) {
      where.push(`${field} = ?`);
      values.push(filters[field]);
    }
  }
  // This value is not user SQL; selecting it from a short allow-list prevents ORDER BY injection.
  const orderBy = filters.sort === "salary" ? "salary DESC, id ASC" : "posted_days_ago ASC, id DESC";
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await pool.execute(`SELECT ${jobColumns} FROM jobs ${clause} ORDER BY ${orderBy}`, values);
  return rows.map(mapJob);
}

export async function findJobById(id) {
  const [rows] = await pool.execute(`SELECT ${jobColumns} FROM jobs WHERE id = ?`, [id]);
  return mapJob(rows[0]);
}
