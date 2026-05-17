// ============================================================
// Kogui App — App.tsx
// ============================================================
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import AppRouter from '@/router/AppRouter';

// ── Error Boundary para capturar errores silenciosos ──────────
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Kogui ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: 600,
            margin: '4rem auto',
            fontFamily: 'system-ui, sans-serif',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: 8,
          }}
        >
          <h1 style={{ color: '#856404', marginBottom: '1rem' }}>
            ⚠️ Error en la aplicación
          </h1>
          <pre
            style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: 4,
              fontSize: '0.8rem',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              color: '#721c24',
            }}
          >
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

