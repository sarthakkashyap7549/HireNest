import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { cleanupIdentities, login, newIdentity, register, request } from "./test-support.js";

const identities = [];

before(() => {
  identities.push(newIdentity());
});

after(async () => {
  await cleanupIdentities(identities);
});

test("registers, rejects duplicate registration, logs in, and rejects incorrect credentials", async () => {
  const identity = identities[0];
  const registered = await register(identity);

  const duplicate = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(identity),
  });
  assert.equal(duplicate.response.status, 409);
  assert.match(duplicate.body.message, /already exists/i);

  const authenticated = await login(identity.email, identity.password);
  assert.equal(authenticated.user.email, identity.email);

  const invalid = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: identity.email, password: "WrongPassword9A" }),
  });
  assert.equal(invalid.response.status, 401);
  assert.match(invalid.body.message, /incorrect/i);

  const currentUser = await request("/auth/me", { token: authenticated.token });
  assert.equal(currentUser.response.status, 200);
  assert.equal(currentUser.body.user.id, registered.user.id);
});

test("rejects malformed registration input", async () => {
  const result = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: "not-an-email" }),
  });
  assert.equal(result.response.status, 400);
  assert.ok(result.body.message);
  assert.ok(result.body.errors);
});
