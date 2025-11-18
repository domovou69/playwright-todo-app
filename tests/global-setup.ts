import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login page
  await page.goto('http://localhost:5173/login');

  // Login with demo credentials
  await page.locator('[data-testid="username-input"]').fill('demo');
  await page.locator('[data-testid="password-input"]').fill('password123');
  await page.locator('[data-testid="login-button"]').click();

  // Wait for navigation to todos page
  await page.waitForURL(/\/todos/);

  // Save authenticated state
  const authFile = path.join(__dirname, '.auth/user.json');
  await context.storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;
