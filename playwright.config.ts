import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  globalTimeout: 360000, // 6 minutes: ~60s beforeAll (signup+login) + ~180s lifecycle + buffer
  maxFailures: 1, // Stop on first failure
  retries: 0, // No automatic retries
  fullyParallel: false,
  workers: 1, // Sequential for easier debugging
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
