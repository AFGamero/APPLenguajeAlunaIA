// ============================================================
// Nebbi App — Router principal con rutas protegidas
// ============================================================
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import LessonPage from '@/pages/lesson/LessonPage';
import NotFound from '@/pages/NotFound';
import AdminRoute from '@/router/AdminRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLessons from '@/pages/admin/AdminLessons';
import LessonBuilder from '@/pages/admin/LessonBuilder';

// ── Spinner de carga ──────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'hsl(40, 20%, 97%)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid hsl(150, 55%, 85%)',
          borderTopColor: 'hsl(150, 50%, 32%)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Ruta protegida: redirige a /login si no hay sesión ────────
function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Mientras carga, mostramos spinner (máx 3s por el timeout del context)
  if (loading) return <LoadingSpinner />;

  // Sin sesión → login
  if (!user) return <Navigate to="/login" replace />;

  return <AppLayout />;
}

// ── Ruta pública: redirige al home si hay sesión activa ───────
// IMPORTANTE: Renderiza los hijos SIEMPRE (no bloquear en loading)
// Solo redirige si la sesión ya está confirmada
function PublicRoute() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  // Durante loading O sin sesión → renderizar la página pública normalmente
  return <Outlet />;
}

// ── AppRouter ─────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
        </Route>

        {/* Rutas Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lessons" element={<AdminLessons />} />
            <Route path="/admin/lessons/new" element={<LessonBuilder />} />
            <Route path="/admin/lessons/edit/:id" element={<LessonBuilder />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

