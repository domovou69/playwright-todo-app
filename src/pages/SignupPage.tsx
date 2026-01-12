import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';
import { authService } from '../services/auth';
import type { SignupCredentials } from '../types/auth';

export function SignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (credentials: SignupCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.signup(credentials);
      navigate('/todos');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Sign Up</h2>
          <SignupForm onSubmit={handleSignup} error={error} isLoading={isLoading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
