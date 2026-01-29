import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login";
import { TodosPage } from "../pages/todos";

export type TestOptions = {
  loginPage: LoginPage;
  todosPage: TodosPage;
};

export const test = base.extend<TestOptions>({
  loginPage: async ({ page }, use) => {
    // setup
    const login = new LoginPage(page);

    // test runs
    await use(login);

    // teardown
    // any code we want to run after the test
  },

  todosPage: async ({ page }, use) => {
    // setup
    const todos = new TodosPage(page);

    // test runs
    await use(todos);

    // teardown
    // any code we want to run after the test
  },
});
