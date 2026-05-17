// ============================================================
// Kogui App — useAuth hook (T-01-05 placeholder)
// Acceso fácil al AuthContext desde cualquier componente
// ============================================================
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}
