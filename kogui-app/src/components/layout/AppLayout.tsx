import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('nebbi_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nebbi_theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuario';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className={styles.layout}>
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>🌿</div>
            <span className={styles.appName}>Nebbi</span>
          </Link>

          <div className={styles.userSection}>
            {userRole === 'admin' && (
              <Link to="/admin" className={styles.adminLink}>
                ⚙️ Panel Admin
              </Link>
            )}
            <button onClick={toggleTheme} className={styles.themeToggle} title="Alternar tema">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/profile" className={styles.userInfoLink}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <div className={styles.avatar}>{initial}</div>
              </div>
            </Link>
            <button onClick={handleLogout} className={styles.btnLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
