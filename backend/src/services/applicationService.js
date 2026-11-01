import { pool } from "../db/pool.js";
import { mapJob } from "./jobService.js";

const applicationColumns = `
  a.id, a.job_id AS jobId, a.status, a.applied_at AS appliedAt,
  j.id AS job_id, j.title, j.company, j.location, j.type, j.mode, j.experience,
  j.salary, j.skills, j.posted_days_ago AS postedDaysAgo, j.description`;

function mapApplication(row) {
  if (!row) return null;
  const job = mapJob({
    id: row.job_id, title: row.title, company: row.company, location: row.location,
    type: row.type, mode: row.mode, experience: row.experience, salary: row.salary,
    skills: row.skills, postedDaysAgo: row.postedDaysAgo, description: row.description,
  });
  const { job_id, title, company, location, type, mode, experience, salary, skills, postedDaysAgo, description, ...application } = row;
  return { ...application, job };
}

export async function listApplicationsForUser(userId) {
  const [rows] = await pool.execute(
    `SELECT ${applicationColumns}
     FROM applications a JOIN jobs j ON j.id = a.job_id
     WHERE a.user_id = ? ORDER BY a.applied_at ASC, a.id ASC`,
    [userId]
  );
  return rows.map(mapApplication);
}

export async function createApplication(userId, jobId) {
  try {
    const [result] = await pool.execute(
      "INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, 'Applied')",
      [userId, jobId]
    );
    const [rows] = await pool.execute(
      `SELECT ${applicationColumns}
       FROM applications a JOIN jobs j ON j.id = a.job_id
       WHERE a.id = ? AND a.user_id = ?`,
      [result.insertId, userId]
    );
    return mapApplication(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      error.status = 409;
      error.message = "You have already applied to this job.";
    }
    throw error;
  }
}

export async function deleteApplicationForUser(id, userId) {
  // Ownership is enforced in the SQL predicate, never through a client-provided user id.
  const [result] = await pool.execute("DELETE FROM applications WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows === 1;
}
