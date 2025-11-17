import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TodoPage } from '../pages/TodoPage';

type PageFixtures = {
  loginPage: LoginPage;
  todoPage: TodoPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
