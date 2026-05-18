export interface ApiUser {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

export interface AuthSession {
  accessToken: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

export interface LessonSummary {
  id: string;
  title: string;
  order_index: number;
  xp_reward: number;
}

export interface ModuleResponse {
  id: string;
  title: string;
  order_index: number;
  description: string | null;
  lessons: LessonSummary[];
}

export interface LessonDetailResponse {
  id: string;
  title: string;
  xp_reward: number;
  content: {
    vocab: any[];
    exercises: any[];
  };
}

export interface ProgressCreate {
  lesson_id: string;
  score: number;
  xp_earned: number;
}

export interface ProgressItem {
  id: string;
  lesson_id: string;
  lesson_title: string;
  completed_at: string;
  score: number;
  xp_earned: number;
}

export interface ProgressListResponse {
  items: ProgressItem[];
}

export interface ProfileResponse {
  display_name: string;
  role: string;
  xp_total: number;
  streak_days: number;
  last_activity: string | null;
}
