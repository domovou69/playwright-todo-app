import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5173/api';

let authToken: string;

test.beforeAll(async ({ request }) => {
  // Login to get auth token
  const response = await request.post(`${API_URL}/auth/login`, {
    data: {
      username: 'testuser',
      password: 'password123',
    },
  });

  const { token } = await response.json();
  authToken = token;
});

test.describe('Todos API', () => {
  test('should get all todos', async ({ request }) => {
    const response = await request.get(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const todos = await response.json();
    expect(Array.isArray(todos)).toBe(true);
  });

  test('should create a todo', async ({ request }) => {
    const response = await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'API Test Todo',
        description: 'Created via API',
        priority: 'medium',
      },
    });

    expect(response.status()).toBe(201);

    const todo = await response.json();
    expect(todo.title).toBe('API Test Todo');
    expect(todo.description).toBe('Created via API');
    expect(todo.priority).toBe('medium');
    expect(todo.status).toBe('pending');
    expect(todo).toHaveProperty('id');
  });

  test('should reject todo creation without title', async ({ request }) => {
    const response = await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        description: 'Missing title',
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('required');
  });

  test('should update a todo', async ({ request }) => {
    // First create a todo
    const createResponse = await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'Original Title',
        description: 'Original Description',
        priority: 'low',
      },
    });

    const createdTodo = await createResponse.json();

    // Then update it
    const updateResponse = await request.put(`${API_URL}/todos/${createdTodo.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'high',
      },
    });

    expect(updateResponse.ok()).toBeTruthy();

    const updatedTodo = await updateResponse.json();
    expect(updatedTodo.title).toBe('Updated Title');
    expect(updatedTodo.description).toBe('Updated Description');
    expect(updatedTodo.priority).toBe('high');
  });

  test('should update todo status', async ({ request }) => {
    // Create a todo
    const createResponse = await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'Status Test',
        description: 'Testing status update',
        priority: 'medium',
      },
    });

    const todo = await createResponse.json();

    // Update status
    const updateResponse = await request.patch(`${API_URL}/todos/${todo.id}/status`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        status: 'completed',
      },
    });

    expect(updateResponse.ok()).toBeTruthy();

    const updatedTodo = await updateResponse.json();
    expect(updatedTodo.status).toBe('completed');
  });

  test('should delete a todo', async ({ request }) => {
    // Create a todo
    const createResponse = await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'To Delete',
        description: 'Will be deleted',
        priority: 'low',
      },
    });

    const todo = await createResponse.json();

    // Delete it
    const deleteResponse = await request.delete(`${API_URL}/todos/${todo.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);

    // Verify it's deleted
    const getResponse = await request.get(`${API_URL}/todos/${todo.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(getResponse.status()).toBe(404);
  });

  test('should filter todos by status', async ({ request }) => {
    // Create todos with different statuses
    await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'Pending Todo',
        description: 'This is pending',
        priority: 'medium',
      },
    });

    const response = await request.get(`${API_URL}/todos?status=pending`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const todos = await response.json();
    expect(Array.isArray(todos)).toBe(true);
    todos.forEach((todo: any) => {
      expect(todo.status).toBe('pending');
    });
  });

  test('should search todos', async ({ request }) => {
    // Create a todo with specific content
    await request.post(`${API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: 'Unique Searchable Title',
        description: 'This has unique content',
        priority: 'medium',
      },
    });

    const response = await request.get(`${API_URL}/todos?search=Unique`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const todos = await response.json();
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.some((todo: any) => todo.title.includes('Unique'))).toBe(true);
  });

  test('should return 401 without auth token', async ({ request }) => {
    const response = await request.get(`${API_URL}/todos`);
    expect(response.status()).toBe(401);
  });

  test('should return 404 for non-existent todo', async ({ request }) => {
    const response = await request.get(`${API_URL}/todos/non-existent-id`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(404);
  });
});
