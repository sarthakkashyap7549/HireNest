import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { cleanupIdentities, login, newIdentity, register, request } from "./test-support.js";

const identities = [];
let token;

before(async () => {
  const identity = newIdentity();
  identities.push(identity);
  await register(identity);
  ({ token } = await login(identity.email, identity.password));
});

after(async () => {
  await cleanupIdentities(identities);
});

test("retrieves jobs, handles empty search results, and persists an application", async () => {
  const jobs = await request("/jobs");
  assert.equal(jobs.response.status, 200);
  assert.ok(Array.isArray(jobs.body.jobs));
  assert.ok(jobs.body.jobs.length > 0);

  const empty = await request("/jobs?q=definitely-no-e2e-job-match");
  assert.equal(empty.response.status, 200);
  assert.deepEqual(empty.body.jobs, []);

  const jobId = jobs.body.jobs[0].id;
  const applied = await request("/applications", {
    method: "POST",
    token,
    body: JSON.stringify({ jobId }),
  });
  assert.equal(applied.response.status, 201);
  assert.equal(applied.body.application.jobId, jobId);

  const listed = await request("/applications", { token });
  assert.equal(listed.response.status, 200);
  assert.ok(listed.body.applications.some((application) => application.jobId === jobId));

  const duplicate = await request("/applications", {
    method: "POST",
    token,
    body: JSON.stringify({ jobId }),
  });
  assert.equal(duplicate.response.status, 409);

  const invalidJob = await request("/applications", {
    method: "POST",
    token,
    body: JSON.stringify({ jobId: 999999999 }),
  });
  assert.equal(invalidJob.response.status, 404);
});

test("rejects protected application access without a valid token", async () => {
  const missing = await request("/applications");
  assert.equal(missing.response.status, 401);

  const invalid = await request("/applications", { token: "not.a.real.jwt" });
  assert.equal(invalid.response.status, 401);
});
