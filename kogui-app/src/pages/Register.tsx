// ============================================================
// Nebbi App — Página Registro
// Implementación de autenticación real
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Auth.module.css';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp({
        email,
        password,
        display_name: name.trim(),
      });
      
      if (signUpError) {
        if (signUpError.message.includes('Ya existe una cuenta con ese correo')) {
          setError('El correo electrónico ya está en uso.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      // Si fue exitoso, redirigimos al home
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado al registrar la cuenta.');
    } finally {
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

        <h2 className={styles.formTitle}>Crear cuenta</h2>

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
            <label htmlFor="register-name" className={styles.label}>
              Nombre
            </label>
            <input
              id="register-name"
              type="text"
              className={styles.input}
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="register-email" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              className={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
             {isLoading ? 'Creando cuenta...' : 'Regístrate'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.switchLink}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
