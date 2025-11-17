import type { Todo, TodoStatus } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusOptions: TodoStatus[] = ['pending', 'in-progress', 'completed'];

export function TodoItem({ todo, onStatusChange, onEdit, onDelete }: TodoItemProps) {
  const isCompleted = todo.status === 'completed';

  return (
    <div
      data-testid="todo-item"
      className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              data-testid="complete-checkbox"
              checked={isCompleted}
              onChange={(e) =>
                onStatusChange(todo.id, e.target.checked ? 'completed' : 'pending')
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <h3
              data-testid="todo-item-title"
              className={`text-lg font-semibold ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
          </div>

          <p className="text-gray-600 mb-2">{todo.description}</p>

          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span
              className={`px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}
              data-testid="todo-priority"
            >
              {todo.priority}
            </span>

            <select
              value={todo.status}
              onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
              data-testid="status-select"
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {todo.dueDate && (
              <span className="text-gray-500">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}

            {todo.tags.length > 0 && (
              <div className="flex gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(todo)}
            data-testid="edit-button"
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            data-testid="delete-button"
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
