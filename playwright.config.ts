import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120000,
  globalTimeout: 600000, // 10 minutes
  maxFailures: 1, // Stop on first failure
  retries: 0, // No automatic retries
  fullyParallel: false,
  workers: 1, // Sequential for easier debugging
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
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
