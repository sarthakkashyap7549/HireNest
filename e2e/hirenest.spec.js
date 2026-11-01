import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import dotenv from "../backend/node_modules/dotenv/lib/main.js";
import mysql from "../backend/node_modules/mysql2/promise.js";

dotenv.config({ path: fileURLToPath(new URL("../backend/.env", import.meta.url)) });

let identity;

test.beforeEach(() => {
  const suffix = randomUUID();
  identity = {
    fullName: `Browser E2E ${suffix.slice(0, 8)}`,
    email: `browser_e2e_${suffix}@example.test`,
    phone: "9876543210",
    role: "Frontend Developer",
    password: `BrowserE2e${suffix.replaceAll("-", "")}A1`,
  };
});

test.afterEach(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
  });
  try {
    const [users] = await connection.execute("SELECT id FROM users WHERE email = ?", [identity.email]);
    if (users.length) {
      await connection.execute("DELETE FROM applications WHERE user_id = ?", [users[0].id]);
      await connection.execute("DELETE FROM users WHERE id = ?", [users[0].id]);
    }
  } finally {
    await connection.end();
  }
});

test("completes registration, dashboard access, job application, and logout", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill(identity.fullName);
  await page.getByLabel("Email").fill(identity.email);
  await page.getByLabel("Mobile number").fill(identity.phone);
  await page.getByLabel("Role you are looking for").selectOption({ label: identity.role });
  await page.getByLabel("Password", { exact: true }).fill(identity.password);
  await page.getByLabel("Confirm password").fill(identity.password);
  await page.getByLabel("I agree to the terms and privacy policy").check();
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard\/profile$/);
  await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();

  await page.getByRole("link", { name: "Job listings" }).first().click();
  await expect(page).toHaveURL(/\/dashboard\/jobs$/);
  await expect(page.getByRole("heading", { name: "Job listings" })).toBeVisible();
  await expect(page.getByText(/\d+ jobs? found/)).toBeVisible();

  const applyButton = page.getByRole("button", { name: "Apply now" }).first();
  await applyButton.click();
  await expect(page.getByRole("button", { name: "Applied" }).first()).toBeVisible();

  await page.getByRole("link", { name: "Applications" }).first().click();
  await expect(page).toHaveURL(/\/dashboard\/applications$/);
  await expect(page.getByText("Applied", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
