import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 60000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    ...devices["Desktop Chrome"],
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --host localhost",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
