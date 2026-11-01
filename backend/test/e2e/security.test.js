import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { after, before, test } from "node:test";
import { cleanupIdentities, login, newIdentity, register, request } from "./test-support.js";

const identities = [];
let firstToken;

before(async () => {
  const first = newIdentity();
  const second = newIdentity();
  identities.push(first, second);
  await register(first);
  await register(second);
  ({ token: firstToken } = await login(first.email, first.password));
});

after(async () => {
  await cleanupIdentities(identities);
});

test("rejects an expired JWT", async () => {
  const expiredToken = jwt.sign(
    { userId: 1, email: "expired@example.test" },
    process.env.JWT_SECRET,
    { expiresIn: -1 }
  );
  const result = await request("/applications", { token: expiredToken });
  assert.equal(result.response.status, 401);
});

test("does not expose one user's private applications to another user", async () => {
  const jobs = await request("/jobs");
  const jobId = jobs.body.jobs[0].id;
  const applied = await request("/applications", {
    method: "POST",
    token: firstToken,
    body: JSON.stringify({ jobId }),
  });
  assert.equal(applied.response.status, 201);

  const secondToken = (await login(identities[1].email, identities[1].password)).token;
  const secondApplications = await request("/applications", { token: secondToken });
  assert.equal(secondApplications.response.status, 200);
  assert.deepEqual(secondApplications.body.applications, []);
});

test("reports unknown routes and network failures distinctly", async () => {
  const missingRoute = await request("/route-that-does-not-exist");
  assert.equal(missingRoute.response.status, 404);

  await assert.rejects(
    fetch("http://127.0.0.1:59999/api/jobs"),
    /fetch failed|ECONNREFUSED/i
  );
});
