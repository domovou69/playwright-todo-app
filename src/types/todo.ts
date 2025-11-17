export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTodoDto {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate?: string | null;
  tags?: string[];
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
  tags?: string[];
}

export interface TodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tag?: string;
}
