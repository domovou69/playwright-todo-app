import { useState } from 'react';
import type { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {error && (
        <div
          data-testid="error-message"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          data-testid="username-input"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          data-testid="password-input"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        data-testid="login-button"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-sm text-gray-600 text-center mt-4">
        <p>Demo credentials:</p>
        <p>Username: <strong>demo</strong> | Password: <strong>password123</strong></p>
      </div>
    </form>
  );
}
