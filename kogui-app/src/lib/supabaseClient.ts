// ============================================================
// Kogui App — Cliente Supabase (T-00-05)
// ============================================================
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const isPlaceholder = (val: string) =>
  !val || val.startsWith('<') || val === 'undefined';

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.warn(
    '[Kogui] ⚠️  Variables de entorno de Supabase no configuradas.\n' +
      'Copia .env.local.example a .env.local y completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.\n' +
      'La autenticación y el progreso no funcionarán hasta que estén configuradas.'
  );
}

// Usamos valores placeholder válidos para que el cliente no falle en modo dev sin credenciales
const safeUrl = isPlaceholder(supabaseUrl)
  ? 'https://placeholder.supabase.co'
  : supabaseUrl;
const safeKey = isPlaceholder(supabaseAnonKey) ? 'placeholder-key' : supabaseAnonKey;

export const supabase = createClient<Database>(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

