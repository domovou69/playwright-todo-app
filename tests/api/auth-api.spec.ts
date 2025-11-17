import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5173/api';

test.describe('Auth API', () => {
  test('should login with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        username: 'demo',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.username).toBe('demo');
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        username: 'invalid',
        password: 'wrong',
      },
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toContain('Invalid credentials');
  });

  test('should reject login with missing credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        username: 'demo',
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('should get current user with valid token', async ({ request }) => {
    // First login to get token
    const loginResponse = await request.post(`${API_URL}/auth/login`, {
      data: {
        username: 'demo',
        password: 'password123',
      },
    });

    const { token } = await loginResponse.json();

    // Then get current user
    const response = await request.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.user.username).toBe('demo');
  });

  test('should reject request without token', async ({ request }) => {
    const response = await request.get(`${API_URL}/auth/me`);

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toContain('No token provided');
  });

  test('should reject request with invalid token', async ({ request }) => {
    const response = await request.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toContain('Invalid token');
  });
});
