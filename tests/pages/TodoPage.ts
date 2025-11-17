import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TodoPage extends BasePage {
  readonly addTodoButton: Locator;
  readonly todoTitleInput: Locator;
  readonly todoDescriptionInput: Locator;
  readonly todoPrioritySelect: Locator;
  readonly saveTodoButton: Locator;
  readonly cancelButton: Locator;
  readonly todoList: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly priorityFilter: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addTodoButton = page.locator('[data-testid="add-todo-button"]');
    this.todoTitleInput = page.locator('[data-testid="todo-title-input"]');
    this.todoDescriptionInput = page.locator('[data-testid="todo-description-input"]');
    this.todoPrioritySelect = page.locator('[data-testid="todo-priority-select"]');
    this.saveTodoButton = page.locator('[data-testid="save-todo-button"]');
    this.cancelButton = page.locator('[data-testid="cancel-button"]');
    this.todoList = page.locator('[data-testid="todo-list"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.statusFilter = page.locator('[data-testid="status-filter"]');
    this.priorityFilter = page.locator('[data-testid="priority-filter"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
  }

  async goto() {
    await super.goto('/todos');
  }

  async createTodo(
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) {
    await this.addTodoButton.click();
    await this.todoTitleInput.fill(title);
    await this.todoDescriptionInput.fill(description);
    await this.todoPrioritySelect.selectOption(priority);
    await this.saveTodoButton.click();
    await this.page.waitForTimeout(500); // Wait for todo to be created
  }

  getTodoItem(title: string): Locator {
    return this.page.locator('[data-testid="todo-item"]', { hasText: title });
  }

  async deleteTodo(title: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.locator('[data-testid="delete-button"]').click();
    await this.page.locator('[data-testid="confirm-delete"]').click();
    await this.page.waitForTimeout(500); // Wait for todo to be deleted
  }

  async markTodoComplete(title: string) {
    const todoItem = this.getTodoItem(title);
    await todoItem.locator('[data-testid="complete-checkbox"]').check();
    await this.page.waitForTimeout(500); // Wait for status update
  }

  async filterByStatus(status: 'pending' | 'in-progress' | 'completed') {
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }

  async searchTodos(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for search to apply
  }

  async getTodoCount(): Promise<number> {
    return await this.page.locator('[data-testid="todo-item"]').count();
  }

  async getTodoTitles(): Promise<string[]> {
    const items = await this.page.locator('[data-testid="todo-item-title"]').all();
    const titles: string[] = [];
    for (const item of items) {
      const text = await item.textContent();
      if (text) titles.push(text.trim());
    }
    return titles;
  }

  async logout() {
    await this.logoutButton.click();
  }
}
