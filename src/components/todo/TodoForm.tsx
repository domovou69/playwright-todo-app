import { useState } from 'react';
import type { CreateTodoDto, TodoPriority } from '../../types/todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, onCancel, isLoading }: TodoFormProps) {
  const [formData, setFormData] = useState<CreateTodoDto>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          data-testid="todo-title-input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          data-testid="todo-description-input"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          data-testid="todo-priority-select"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value as TodoPriority })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          data-testid="todo-due-date-input"
          value={formData.dueDate || ''}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            id="tags"
            type="text"
            data-testid="todo-tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a tag and press Enter"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addTag}
            data-testid="add-tag-button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                data-testid={`tag-${tag}`}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          data-testid="save-todo-button"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Todo'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-testid="cancel-button"
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
