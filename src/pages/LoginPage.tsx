import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { authService } from '../services/auth';
import type { LoginCredentials } from '../types/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(credentials);
      navigate('/todos');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Playwright Training Demo</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Login</h2>
          <LoginForm onSubmit={handleLogin} error={error} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
