import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from './db';

const SALT_ROUNDS = 10;

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Seed with demo users
export async function seedDatabase() {
  const demoUser = getUserByUsername('demo');
  const testUser = getUserByUsername('testuser');

  if (!demoUser) {
    await createUser({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password123',
    });
    console.log('Created demo user');
  }

  if (!testUser) {
    await createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('Created test user');
  }

  console.log('Database seeded with demo users');
}

// User operations
export function getUserByUsername(username: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | undefined;
}

export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const id = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO users (id, username, email, password)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, data.username, data.email, hashedPassword);

  return {
    id,
    username: data.username,
    email: data.email,
    password: hashedPassword,
  };
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Todo operations
export function getTodosByUser(userId: string): Todo[] {
  const stmt = db.prepare(`
    SELECT
      id,
      title,
      description,
      status,
      priority,
      due_date as dueDate,
      tags,
      created_at as createdAt,
      updated_at as updatedAt,
      user_id as userId
    FROM todos
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);

  const rows = stmt.all(userId) as any[];

  // Parse tags from JSON string
  return rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags),
  }));
}

export function getTodoById(id: string, userId: string): Todo | undefined {
  const stmt = db.prepare(`
    SELECT
      id,
      title,
      description,
      status,
      priority,
      due_date as dueDate,
      tags,
      created_at as createdAt,
      updated_at as updatedAt,
      user_id as userId
    FROM todos
    WHERE id = ? AND user_id = ?
  `);

  const row = stmt.get(id, userId) as any;

  if (!row) return undefined;

  return {
    ...row,
    tags: JSON.parse(row.tags),
  };
}

export function createTodo(data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
  const now = new Date().toISOString();
  const id = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO todos (id, title, description, status, priority, due_date, tags, created_at, updated_at, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.title,
    data.description,
    data.status,
    data.priority,
    data.dueDate,
    JSON.stringify(data.tags),
    now,
    now,
    data.userId
  );

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTodo(
  id: string,
  userId: string,
  data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>
): Todo | null {
  const todo = getTodoById(id, userId);
  if (!todo) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const updates: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
  }
  if (data.priority !== undefined) {
    updates.push('priority = ?');
    values.push(data.priority);
  }
  if (data.dueDate !== undefined) {
    updates.push('due_date = ?');
    values.push(data.dueDate);
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    values.push(JSON.stringify(data.tags));
  }

  updates.push('updated_at = ?');
  values.push(updatedAt);

  values.push(id, userId);

  const stmt = db.prepare(`
    UPDATE todos
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `);

  stmt.run(...values);

  return getTodoById(id, userId)!;
}

export function deleteTodo(id: string, userId: string): boolean {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  const result = stmt.run(id, userId);
  return result.changes > 0;
}

export function getAllTags(userId: string): string[] {
  const userTodos = getTodosByUser(userId);
  const tagSet = new Set<string>();
  userTodos.forEach(todo => {
    todo.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
}

// Clear all todos for a user (useful for testing)
export function clearDatabase(userId?: string) {
  if (userId) {
    const stmt = db.prepare('DELETE FROM todos WHERE user_id = ?');
    stmt.run(userId);
  } else {
    // Clear all todos (but keep users)
    db.prepare('DELETE FROM todos').run();
  }
}

// Reset entire database (useful for testing)
export function resetDatabase() {
  db.prepare('DELETE FROM todos').run();
  db.prepare('DELETE FROM users').run();
}

// Initialize database with seed data
seedDatabase().catch(console.error);
