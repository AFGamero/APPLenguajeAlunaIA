// ============================================================
// Kogui App — Tipos de base de datos Supabase
// Generados manualmente según el esquema en:
//   supabase/migrations/001_initial_schema.sql
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ── Tabla: profiles ──────────────────────────────────────────
export interface Profile {
  id: string;              // UUID — FK → auth.users
  display_name: string;    // Nombre visible del usuario
  xp_total: number;        // XP acumulado total (DEFAULT 0)
  streak_days: number;     // Racha diaria actual (DEFAULT 0)
  last_activity: string | null; // ISO 8601 — última lección completada
  created_at: string;      // ISO 8601 — fecha de registro
}

// ── Tabla: modules ───────────────────────────────────────────
export interface Module {
  id: string;
  title: string;
  order_index: number;
  description: string | null;
}

// ── Tipos de contenido de una lección (JSONB) ─────────────────

export interface VocabItem {
  word_kogui: string;       // Palabra en lengua Kogui
  phonetic: string;         // Transcripción fonética
  translation: string;      // Traducción al español
  cultural_note: string;    // Nota cultural breve
  audio_url: string | null; // URL en Supabase Storage (null → Web Speech API)
}

export interface MultipleChoiceExercise {
  type: 'multiple_choice';
  question: string;           // Palabra Kogui a identificar
  options: string[];          // 4 opciones (español)
  correct_index: number;      // Índice de la opción correcta (0–3)
  hint: string;               // Pista tras primer error
}

export interface MatchExercise {
  type: 'match';
  pairs: Array<{ kogui: string; spanish: string }>; // Pares a emparejar
  hint: string;               // Pista tras 3 fallos
}

export interface WriteExercise {
  type: 'write';
  prompt: string;             // Texto en español a traducir al Kogui
  answer: string;             // Respuesta correcta (validación case-insensitive)
  hint: string;               // Pista automática tras 6 segundos
}

export type Exercise = MultipleChoiceExercise | MatchExercise | WriteExercise;

export interface LessonContent {
  vocab: VocabItem[];
  exercises: Exercise[];
}

// ── Tabla: lessons ───────────────────────────────────────────
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  xp_reward: number;       // DEFAULT 30
  content: LessonContent;  // JSONB parseado
}

// ── Tabla: user_progress ─────────────────────────────────────
export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;    // ISO 8601
  score: number;           // Respuestas correctas sobre total
  xp_earned: number;       // XP ganado en esta sesión
}

// ── Tipo de base de datos para supabase-js ───────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      modules: {
        Row: Module;
        Insert: Omit<Module, 'id'> & { id?: string };
        Update: Partial<Omit<Module, 'id'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id'> & { id?: string };
        Update: Partial<Omit<Lesson, 'id'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'completed_at'> & {
          id?: string;
          completed_at?: string;
        };
        Update: Partial<Omit<UserProgress, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
