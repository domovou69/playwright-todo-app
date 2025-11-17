import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

// Setup fixture that runs once per worker
export const setupAuth = base.extend<{}, { authenticatedUser: void }>({
  authenticatedUser: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('demo', 'password123');
      await expect(page).toHaveURL(/\/todos/);

      // Save authentication state
      await context.storageState({ path: authFile });
      await context.close();

      await use();
    },
    { scope: 'worker' },
  ],
});

// Test fixture that uses authenticated state
export const test = base.extend<{ authenticatedPage: typeof base.prototype.page }>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: authFile,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
