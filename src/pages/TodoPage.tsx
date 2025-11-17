import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { TodoForm } from '../components/todo/TodoForm';
import { TodoList } from '../components/todo/TodoList';
import { TodoFilters } from '../components/todo/TodoFilters';
import { ConfirmDialog } from '../components/layout/ConfirmDialog';
import { authService } from '../services/auth';
import { todoService } from '../services/todos';
import type { Todo, CreateTodoDto, TodoFilter, TodoStatus } from '../types/todo';

export function TodoPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilter>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; todoId: string | null }>({
    isOpen: false,
    todoId: null,
  });

  const loadTodos = async () => {
    try {
      setError(null);
      const data = await todoService.getTodos(filters);
      setTodos(data);
    } catch (err: any) {
      setError('Failed to load todos');
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filters]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleCreateTodo = async (data: CreateTodoDto) => {
    setIsLoading(true);
    try {
      await todoService.createTodo(data);
      setIsFormOpen(false);
      await loadTodos();
    } catch (err: any) {
      setError('Failed to create todo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: TodoStatus) => {
    try {
      await todoService.updateTodoStatus(id, status);
      await loadTodos();
    } catch (err: any) {
      setError('Failed to update todo status');
      console.error(err);
    }
  };

  const handleEdit = async (todo: Todo) => {
    // For simplicity in this demo, we'll just allow re-creating
    // In a real app, you'd open an edit form with the todo data
    alert('Edit functionality - in a real app, this would open an edit form');
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, todoId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.todoId) {
      try {
        await todoService.deleteTodo(deleteConfirm.todoId);
        await loadTodos();
      } catch (err: any) {
        setError('Failed to delete todo');
        console.error(err);
      }
    }
    setDeleteConfirm({ isOpen: false, todoId: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div
            data-testid="error-message"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Todos</h2>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              data-testid="add-todo-button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Add Todo
            </button>
          )}
        </div>

        {isFormOpen && (
          <div className="mb-6">
            <TodoForm
              onSubmit={handleCreateTodo}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TodoFilters filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <TodoList
              todos={todos}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, todoId: null })}
      />
    </div>
  );
}
