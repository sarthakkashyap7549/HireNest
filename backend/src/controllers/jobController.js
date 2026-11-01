import { findJobById, listJobs } from "../services/jobService.js";
import { requirePositiveInteger } from "../utils/validators.js";

export async function getJobs(req, res) {
  const jobs = await listJobs(req.query);
  res.status(200).json({ jobs });
}

export async function getJobById(req, res) {
  const job = await findJobById(requirePositiveInteger(req.params.id, "jobId"));
  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ job });
}
