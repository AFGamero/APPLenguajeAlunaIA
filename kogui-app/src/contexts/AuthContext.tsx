// ============================================================
// Kogui App — AuthContext
// Provee estado de sesión reactivo basado en Supabase Auth
// ============================================================
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ data: any; error: any }>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  userRole: null,
  loading: false,
  signIn: async () => ({ data: null, error: new Error('Auth not initialized') }),
  signUp: async () => ({ data: null, error: new Error('Auth not initialized') }),
  signOut: async () => ({ error: new Error('Auth not initialized') }),
});

// Detectamos si Supabase está configurado correctamente
const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return (
    !!url &&
    !!key &&
    !url.startsWith('<') &&
    !key.startsWith('<') &&
    url !== 'undefined' &&
    key !== 'undefined'
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase no está configurado, no intentamos conectarnos
    if (!isSupabaseConfigured()) {
      console.warn('[Nebbi] Supabase no configurado. Auth deshabilitado en modo demo.');
      return;
    }

    let unsubscribe: (() => void) | null = null;

    // Carga asíncrona del cliente Supabase solo cuando está configurado
    import('@/lib/supabaseClient')
      .then(({ supabase }) => {
        // Suscribirse a cambios de sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              const profileQuery: any = supabase.from('profiles');
              const { data } = await profileQuery.select('role').eq('id', session.user.id).single();
              setUserRole(data?.role || 'estudiante');
            } else {
              setUserRole(null);
            }
            setLoading(false);
          }
        );
        unsubscribe = () => subscription.unsubscribe();

        // También cargar sesión inicial
        return supabase.auth.getSession();
      })
      .then(async (result) => {
        if (result) {
          const { data: { session } } = result;
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            const { supabase } = await import('@/lib/supabaseClient');
            const profileQuery: any = supabase.from('profiles');
            const { data } = await profileQuery.select('role').eq('id', session.user.id).single();
            setUserRole(data?.role || 'estudiante');
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('[Nebbi] Error al inicializar auth:', err);
        setLoading(false);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    const { supabase } = await import('@/lib/supabaseClient');
    return supabase.auth.signInWithPassword(credentials);
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    const { supabase } = await import('@/lib/supabaseClient');
    return supabase.auth.signUp(credentials);
  };

  const signOut = async () => {
    const { supabase } = await import('@/lib/supabaseClient');
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

