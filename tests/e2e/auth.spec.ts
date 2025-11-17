import { test, expect } from '../fixtures/page.fixture';

test.describe('Authentication', () => {
  test('should display login page', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('demo', 'password123');

    expect(await loginPage.isLoggedIn()).toBe(true);
    await expect(loginPage.page).toHaveURL(/\/todos/);
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid', 'wrong');

    const error = await loginPage.getError();
    expect(error).toContain('Invalid credentials');
  });

  test('should show error with missing credentials', async ({ loginPage }) => {
    await loginPage.goto();

    // Try to submit with empty fields
    await loginPage.loginButton.click();

    // HTML5 validation should prevent submission
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test('should logout successfully', async ({ loginPage, todoPage }) => {
    await loginPage.goto();
    await loginPage.login('demo', 'password123');
    await expect(todoPage.page).toHaveURL(/\/todos/);

    await todoPage.logout();
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/todos');
    await expect(page).toHaveURL(/\/login/);
  });
});
