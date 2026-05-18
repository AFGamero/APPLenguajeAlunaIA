import type {
  ModuleResponse,
  LessonDetailResponse,
  ProfileResponse,
  ProgressCreate,
  ProgressListResponse,
  TokenResponse,
  ApiUser,
} from '@/types/api';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';
const TOKEN_STORAGE_KEY = 'nebbi_access_token';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.detail || message;
    } catch {
      const rawText = await response.text();
      if (rawText) {
        message = rawText;
      }
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export const apiClient = {
  auth: {
    register(payload: { email: string; password: string; display_name: string }) {
      return request<TokenResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    login(payload: { email: string; password: string }) {
      return request<TokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    me() {
      return request<ApiUser>('/auth/me');
    },
  },
  modules: {
    list() {
      return request<ModuleResponse[]>('/modules');
    },
  },
  lessons: {
    get(lessonId: string) {
      return request<LessonDetailResponse>(`/lessons/${lessonId}`);
    },
  },
  progress: {
    list() {
      return request<ProgressListResponse>('/progress');
    },
    save(payload: ProgressCreate) {
      return request('/progress', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },
  profile: {
    get() {
      return request<ProfileResponse>('/profile');
    },
    update(payload: { display_name: string }) {
      return request<ProfileResponse>('/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
  },
};
