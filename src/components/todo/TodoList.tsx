import { TodoItem } from './TodoItem';
import type { Todo, TodoStatus } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  onStatusChange: (id: string, status: TodoStatus) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onStatusChange, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No todos found</p>
        <p className="text-sm mt-2">Create your first todo to get started!</p>
      </div>
    );
  }

  return (
    <div data-testid="todo-list" className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
