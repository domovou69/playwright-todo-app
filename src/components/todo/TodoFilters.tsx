import type { TodoFilter, TodoStatus, TodoPriority } from '../../types/todo';

interface TodoFiltersProps {
  filters: TodoFilter;
  onFilterChange: (filters: TodoFilter) => void;
}

export function TodoFilters({ filters, onFilterChange }: TodoFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          type="text"
          data-testid="search-input"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value || undefined })}
          placeholder="Search todos..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status-filter"
          data-testid="status-filter"
          value={filters.status || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: (e.target.value as TodoStatus) || undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority-filter"
          data-testid="priority-filter"
          value={filters.priority || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: (e.target.value as TodoPriority) || undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {(filters.status || filters.priority || filters.search) && (
        <button
          onClick={() => onFilterChange({})}
          data-testid="clear-filters-button"
          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-600"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
