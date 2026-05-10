import { defineConfig, devices } from "@playwright/test"
import { configure } from "passmark"
import { isGenerationMode, targetAppUrl } from "./src/env"

configure({
  ai: {
    gateway: "openrouter",
    models: {
      stepExecution: "anthropic/claude-haiku-4.5"
    }
  }
})

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: isGenerationMode ? "**/ui-design.spec.ts" : undefined,
  /* Update snapshots in generation mode, never in test mode */
  updateSnapshots: isGenerationMode ? "all" : "none",
  /* Screenshot directory for all modes */
  snapshotDir: "./baseline/screenshots",
  /* Snapshot path template - saves directly to snapshotDir without subdirectories */
  snapshotPathTemplate: "{snapshotDir}/{arg}{ext}",

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL configured based on mode */
    baseURL: targetAppUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
})
