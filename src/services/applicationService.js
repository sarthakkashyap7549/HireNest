import { http, USE_MOCK, delay } from "./http";

const KEY = "hirenest_applications";
const readAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; }
};
const writeAll = (items) => localStorage.setItem(KEY, JSON.stringify(items));

/*
 * BACKEND CONTRACT
 *   GET    /applications        -> { applications: [{ id, jobId, status, appliedAt, job }] }
 *   POST   /applications        body { jobId } -> { application }
 *   DELETE /applications/:id    -> { ok: true }
 * The server should read the user from the auth token, not from the request body.
 */
export const applicationService = {
  async list(userId) {
    if (!USE_MOCK) {
      const { applications } = await http("/applications");
      return applications;
    }
    await delay(200);
    return readAll().filter((a) => a.userId === userId);
  },

  async apply(userId, job) {
    if (!USE_MOCK) {
      const { application } = await http("/applications", { method: "POST", body: { jobId: job.id } });
      return application;
    }
    await delay(250);
    const application = {
      id: crypto.randomUUID(),
      userId,
      jobId: job.id,
      status: "Applied",
      appliedAt: new Date().toISOString(),
      job, // the backend can send a populated job or just jobId; UI handles both via jobs lookup
    };
    writeAll([...readAll(), application]);
    return application;
  },

  async withdraw(id) {
    if (!USE_MOCK) {
      await http(`/applications/${id}`, { method: "DELETE" });
      return;
    }
    await delay(200);
    writeAll(readAll().filter((a) => a.id !== id));
  },
};
