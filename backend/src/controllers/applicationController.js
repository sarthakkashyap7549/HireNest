import { createApplication, deleteApplicationForUser, listApplicationsForUser } from "../services/applicationService.js";
import { findJobById } from "../services/jobService.js";
import { requirePositiveInteger } from "../utils/validators.js";

export async function listApplications(req, res) {
  const applications = await listApplicationsForUser(req.user.userId);
  res.status(200).json({ applications });
}

export async function apply(req, res) {
  const jobId = requirePositiveInteger(req.body?.jobId, "jobId");
  if (!await findJobById(jobId)) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }
  const application = await createApplication(req.user.userId, jobId);
  res.status(201).json({ application });
}

export async function withdraw(req, res) {
  const id = requirePositiveInteger(req.params.id, "applicationId");
  if (!await deleteApplicationForUser(id, req.user.userId)) {
    const error = new Error("Application not found.");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ ok: true });
}
