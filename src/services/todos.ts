import { api } from './api';
import type { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../types/todo';

export const todoService = {
  async getTodos(filters?: TodoFilter): Promise<Todo[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tag) params.append('tag', filters.tag);

    const query = params.toString();
    return api.get<Todo[]>(`/todos${query ? `?${query}` : ''}`);
  },

  async getTodo(id: string): Promise<Todo> {
    return api.get<Todo>(`/todos/${id}`);
  },

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    return api.post<Todo>('/todos', data);
  },

  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> {
    return api.put<Todo>(`/todos/${id}`, data);
  },

  async updateTodoStatus(id: string, status: 'pending' | 'in-progress' | 'completed'): Promise<Todo> {
    return api.patch<Todo>(`/todos/${id}/status`, { status });
  },

  async deleteTodo(id: string): Promise<void> {
    return api.delete(`/todos/${id}`);
  },

  async getAllTags(): Promise<string[]> {
    return api.get<string[]>('/todos/tags/all');
  },
};
