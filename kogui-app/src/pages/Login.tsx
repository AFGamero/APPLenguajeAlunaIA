// ============================================================
// Nebbi App — Página Login
// Implementación de autenticación real
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn({ email, password });
      
      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Email o contraseña incorrectos.');
        } else if (signInError.message === 'Auth not initialized') {
            setError('La autenticación no está disponible en este momento.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      // Si fue exitoso, redirigimos al home
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>🌿</div>
          <h1 className={styles.appName}>Nebbi</h1>
          <p className={styles.tagline}>Aprende la lengua de la Sierra Nevada</p>
        </div>

        <h2 className={styles.formTitle}>Iniciar sesión</h2>

        {error && (
          <div style={{
            background: 'var(--color-error-light)',
            color: 'var(--color-error-dark)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--font-size-sm)',
            border: '1px solid var(--color-error)'
          }}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="login-email" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
            {isLoading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.switchLink}>
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}

