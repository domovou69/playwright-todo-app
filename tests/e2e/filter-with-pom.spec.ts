import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";

const username = "demo";
const password = "password123";

test.describe("Filter Todos by Priority", () => {
  test("Filter by low priority", async ({ page }) => {
    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page).toHaveURL("/todos");

    await page.getByRole("combobox", { name: "priority" }).selectOption("low");
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "low" })
    ).toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "medium" })
    ).not.toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "high" })
    ).not.toBeVisible();
  });

  test("Filter by medium priority", async ({ page }) => {
    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page).toHaveURL("/todos");

    await page
      .getByRole("combobox", { name: "priority" })
      .selectOption("medium");
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "low" })
    ).not.toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "medium" })
    ).toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "high" })
    ).not.toBeVisible();
  });

  test("Filter by high priority", async ({ page }) => {
    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page).toHaveURL("/todos");

    await page.getByRole("combobox", { name: "priority" }).selectOption("high");
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "low" })
    ).not.toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "medium" })
    ).not.toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "high" })
    ).toBeVisible();
  });

  test("Clear priority filter", async ({ page }) => {
    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await expect(page).toHaveURL("/todos");

    await page.getByRole("combobox", { name: "priority" }).selectOption("low");
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "high" })
    ).not.toBeVisible();
    await page.getByRole("button", { name: "Clear Filters" }).click();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "low" })
    ).toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "medium" })
    ).toBeVisible();
    await expect(
      page.getByTestId("todo-item").filter({ hasText: "high" })
    ).toBeVisible();
  });
});
