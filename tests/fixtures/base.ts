import { test as base } from "@playwright/test";

import { LoginPage } from "../pages/login";
import { TodosPage } from "../pages/todos";

export type TestOptions = {
  loginPage: LoginPage;
  todosPage: TodosPage;
};

export const test = base.extend<TestOptions>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },
  todosPage: async ({ page }, use) => {
    const todos = new TodosPage(page);
    await use(todos);
  },
});
