import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would be hashed
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

// In-memory storage
const users: Map<string, User> = new Map();
const todos: Map<string, Todo> = new Map();

// Seed with demo users
export function seedDatabase() {
  const demoUser: User = {
    id: uuidv4(),
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123', // In production, use bcrypt
  };

  const testUser: User = {
    id: uuidv4(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  users.set(demoUser.username, demoUser);
  users.set(testUser.username, testUser);

  console.log('Database seeded with demo users');
}

// User operations
export function getUserByUsername(username: string): User | undefined {
  return users.get(username);
}

export function getUserById(id: string): User | undefined {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return undefined;
}

// Todo operations
export function getTodosByUser(userId: string): Todo[] {
  return Array.from(todos.values()).filter(todo => todo.userId === userId);
}

export function getTodoById(id: string, userId: string): Todo | undefined {
  const todo = todos.get(id);
  if (todo && todo.userId === userId) {
    return todo;
  }
  return undefined;
}

export function createTodo(data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  todos.set(todo.id, todo);
  return todo;
}

export function updateTodo(
  id: string,
  userId: string,
  data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>
): Todo | null {
  const todo = todos.get(id);
  if (!todo || todo.userId !== userId) {
    return null;
  }

  const updatedTodo: Todo = {
    ...todo,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  todos.set(id, updatedTodo);
  return updatedTodo;
}

export function deleteTodo(id: string, userId: string): boolean {
  const todo = todos.get(id);
  if (!todo || todo.userId !== userId) {
    return false;
  }
  return todos.delete(id);
}

export function getAllTags(userId: string): string[] {
  const userTodos = getTodosByUser(userId);
  const tagSet = new Set<string>();
  userTodos.forEach(todo => {
    todo.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
}

// Clear all data (useful for testing)
export function clearDatabase() {
  todos.clear();
}

// Initialize database
seedDatabase();
