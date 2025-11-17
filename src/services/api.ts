import { storage } from '../utils/storage';

const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = storage.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response;
}

export const api = {
  async get<T>(url: string): Promise<T> {
    const response = await fetchWithAuth(url);
    return response.json();
  },

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async patch<T>(url: string, data: any): Promise<T> {
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(url: string): Promise<void> {
    await fetchWithAuth(url, {
      method: 'DELETE',
    });
  },
};
