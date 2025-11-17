import { authService } from '../../services/auth';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const user = authService.getStoredUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            <p className="text-sm text-gray-500">Playwright Training Demo</p>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, <strong>{user.username}</strong>
              </span>
              <button
                onClick={onLogout}
                data-testid="logout-button"
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
