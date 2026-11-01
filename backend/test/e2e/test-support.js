import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const API_URL = process.env.TEST_API_URL || "http://localhost:5000/api";
export const TEST_PASSWORD = `E2eTest${randomUUID().replaceAll("-", "")}A1`;

export function newIdentity() {
  const suffix = randomUUID();
  return {
    fullName: `HireNest E2E ${suffix.slice(0, 8)}`,
    email: `e2e_${suffix}@example.test`,
    phone: "9876543210",
    role: "Frontend Developer",
    password: TEST_PASSWORD,
  };
}

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
    ...options,
  });
  const text = await response.text();
  let body = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }
  return { response, body };
}

export async function register(identity) {
  const result = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(identity),
  });
  assert.equal(result.response.status, 201);
  assert.ok(result.body.user?.id);
  assert.ok(result.body.token);
  return result.body;
}

export async function login(email, password) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  assert.equal(result.response.status, 200);
  assert.ok(result.body.token);
  return result.body;
}

export async function openDatabase() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
  });
}

export async function cleanupIdentities(identities) {
  if (!identities.length) return;
  const emails = identities.map(({ email }) => email);
  const connection = await openDatabase();
  try {
    const placeholders = emails.map(() => "?").join(",");
    await connection.execute(
      `DELETE FROM applications WHERE user_id IN (SELECT id FROM users WHERE email IN (${placeholders}))`,
      emails
    );
    await connection.execute(`DELETE FROM users WHERE email IN (${placeholders})`, emails);
  } finally {
    await connection.end();
  }
}
