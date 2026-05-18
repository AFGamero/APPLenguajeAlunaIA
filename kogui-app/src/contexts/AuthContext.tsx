import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, clearAccessToken, getAccessToken, setAccessToken } from '@/lib/apiClient';
import type { ApiUser, AuthSession, TokenResponse } from '@/types/api';

interface AuthContextValue {
  user: ApiUser | null;
  session: AuthSession | null;
  userRole: string | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<{ data: TokenResponse | null; error: Error | null }>;
  signUp: (credentials: {
    email: string;
    password: string;
    display_name: string;
  }) => Promise<{ data: TokenResponse | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await apiClient.auth.me();
        setSession({ accessToken: token });
        setUser(currentUser);
        setUserRole(currentUser.role);
      } catch (err) {
        console.warn('[Nebbi] Error al restaurar sesión:', err);
        clearAccessToken();
        setSession(null);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const data = await apiClient.auth.login(credentials);
      setAccessToken(data.access_token);
      setSession({ accessToken: data.access_token });
      setUser(data.user);
      setUserRole(data.user.role);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (credentials: { email: string; password: string; display_name: string }) => {
    try {
      const data = await apiClient.auth.register(credentials);
      setAccessToken(data.access_token);
      setSession({ accessToken: data.access_token });
      setUser(data.user);
      setUserRole(data.user.role);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    clearAccessToken();
    setSession(null);
    setUser(null);
    setUserRole(null);
    return { error: null };
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
