import type {
  AdminLessonDetail,
  AdminLessonListItem,
  AdminLessonUpsert,
  AdminModule,
  AdminStatsResponse,
  ModuleResponse,
  LessonDetailResponse,
  ProfileResponse,
  ProgressCreate,
  ProgressListResponse,
  TokenResponse,
  ApiUser,
} from '@/types/api';

const rawApiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE_URL = (rawApiBaseUrl || 'http://localhost:8000').replace(/\/+$/, '');
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

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    const isMixedContent =
      window.location.protocol === 'https:' && API_BASE_URL.startsWith('http://');
    const message = isMixedContent
      ? `No se pudo conectar con la API (${API_BASE_URL}). El frontend está en HTTPS y la API en HTTP.`
      : `No se pudo conectar con la API (${API_BASE_URL}). Verifica VITE_API_URL y que el backend esté ejecutándose.`;
    throw new Error(message);
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    const rawText = await response.text();
    if (rawText) {
      try {
        const errorBody = JSON.parse(rawText) as { detail?: string };
        message = errorBody.detail || rawText;
      } catch {
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
  admin: {
    stats() {
      return request<AdminStatsResponse>('/admin/stats');
    },
    modules() {
      return request<AdminModule[]>('/admin/modules');
    },
    lessons() {
      return request<AdminLessonListItem[]>('/admin/lessons');
    },
    getLesson(lessonId: string) {
      return request<AdminLessonDetail>(`/admin/lessons/${lessonId}`);
    },
    createLesson(payload: AdminLessonUpsert) {
      return request<AdminLessonDetail>('/admin/lessons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    updateLesson(lessonId: string, payload: AdminLessonUpsert) {
      return request<AdminLessonDetail>(`/admin/lessons/${lessonId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    async deleteLesson(lessonId: string) {
      await request<{ deleted: boolean }>(`/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      });
    },
  },
};
