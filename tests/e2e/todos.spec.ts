import { test, expect } from '../fixtures/todo.fixture';

test.describe('Todo Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all todos before each test
    await page.request.delete('http://localhost:5173/api/todos');
    // Each test starts with a clean slate by using authenticated fixture
    await page.goto('/todos');
  });

  test('should display todo page after login', async ({ todoPage }) => {
    await expect(todoPage.addTodoButton).toBeVisible();
    await expect(todoPage.page.locator('text=My Todos')).toBeVisible();
  });

  test('should create a new todo', async ({ todoPage }) => {
    await todoPage.createTodo('Test Todo', 'Test Description', 'high');

    await expect(todoPage.getTodoItem('Test Todo')).toBeVisible();
    const titles = await todoPage.getTodoTitles();
    expect(titles).toContain('Test Todo');
  });

  test('should display todo with correct priority', async ({ todoPage }) => {
    await todoPage.createTodo('Priority Test', 'Testing priority', 'high');

    const todoItem = todoPage.getTodoItem('Priority Test');
    await expect(todoItem).toContainText('high');
  });

  test('should mark todo as complete', async ({ todoPage }) => {
    await todoPage.createTodo('Complete Me', 'Test completion', 'medium');
    await todoPage.markTodoComplete('Complete Me');

    const todoItem = todoPage.getTodoItem('Complete Me');
    const checkbox = todoItem.locator('[data-testid="complete-checkbox"]');
    await expect(checkbox).toBeChecked();
  });

  test('should delete a todo', async ({ todoPage }) => {
    await todoPage.createTodo('To Delete', 'Will be deleted', 'low');

    const initialCount = await todoPage.getTodoCount();
    await todoPage.deleteTodo('To Delete');

    const finalCount = await todoPage.getTodoCount();
    expect(finalCount).toBe(initialCount - 1);

    const titles = await todoPage.getTodoTitles();
    expect(titles).not.toContain('To Delete');
  });

  test('should filter todos by status', async ({ todoPage }) => {
    // Create todos with different statuses
    await todoPage.createTodo('Todo 1', 'Pending todo', 'medium');
    await todoPage.createTodo('Todo 2', 'Will be completed', 'medium');
    await todoPage.markTodoComplete('Todo 2');

    // Filter by completed
    await todoPage.filterByStatus('completed');
    await todoPage.page.waitForTimeout(500);

    const titles = await todoPage.getTodoTitles();
    expect(titles).toContain('Todo 2');
  });

  test('should search todos', async ({ todoPage }) => {
    await todoPage.createTodo('Searchable Todo', 'Find me', 'medium');
    await todoPage.createTodo('Another Todo', 'Different content', 'low');

    await todoPage.searchTodos('Searchable');

    const titles = await todoPage.getTodoTitles();
    expect(titles).toContain('Searchable Todo');
    expect(titles.length).toBeGreaterThan(0);
  });

  test('should show empty state when no todos exist', async ({ todoPage, page }) => {
    // Delete all todos if any exist
    const count = await todoPage.getTodoCount();
    if (count > 0) {
      const titles = await todoPage.getTodoTitles();
      for (const title of titles) {
        await todoPage.deleteTodo(title);
      }
    }

    await expect(page.locator('text=No todos found')).toBeVisible();
  });

  test('should create multiple todos', async ({ todoPage }) => {
    const todos = [
      { title: 'First Todo', description: 'First', priority: 'high' as const },
      { title: 'Second Todo', description: 'Second', priority: 'medium' as const },
      { title: 'Third Todo', description: 'Third', priority: 'low' as const },
    ];

    for (const todo of todos) {
      await todoPage.createTodo(todo.title, todo.description, todo.priority);
    }

    const count = await todoPage.getTodoCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Todo Fixtures Demo', () => {
  test('should use createSampleTodos fixture', async ({ createSampleTodos, todoPage }) => {
    await createSampleTodos();

    const count = await todoPage.getTodoCount();
    expect(count).toBeGreaterThanOrEqual(3);

    const titles = await todoPage.getTodoTitles();
    expect(titles).toContain('Buy groceries');
    expect(titles).toContain('Write report');
    expect(titles).toContain('Call dentist');
  });
});
