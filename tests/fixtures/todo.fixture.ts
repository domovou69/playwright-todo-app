import { test as base } from './auth.fixture';
import { TodoPage } from '../pages/TodoPage';

type TodoFixtures = {
  todoPage: TodoPage;
  createSampleTodos: () => Promise<void>;
  cleanupTodos: () => Promise<void>;
};

export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },

  createSampleTodos: async ({ page }, use) => {
    const createTodos = async () => {
      const todoPage = new TodoPage(page);
      await todoPage.goto();

      const sampleTodos = [
        { title: 'Buy groceries', description: 'Milk, eggs, bread', priority: 'high' as const },
        { title: 'Write report', description: 'Q4 performance report', priority: 'medium' as const },
        { title: 'Call dentist', description: 'Schedule checkup', priority: 'low' as const },
      ];

      for (const todo of sampleTodos) {
        await todoPage.createTodo(todo.title, todo.description, todo.priority);
      }
    };

    await use(createTodos);
  },

  cleanupTodos: async ({ page }, use) => {
    const cleanup = async () => {
      const todoPage = new TodoPage(page);
      await todoPage.goto();

      // Delete all visible todos
      let count = await todoPage.getTodoCount();
      const titles = await todoPage.getTodoTitles();

      for (const title of titles) {
        await todoPage.deleteTodo(title);
      }
    };

    await use(cleanup);
  },
});

export { expect } from '@playwright/test';
