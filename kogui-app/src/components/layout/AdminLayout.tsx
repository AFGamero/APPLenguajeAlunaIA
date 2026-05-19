import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import kwiKwiLogo from '@/assets/KwiKwiLogo.png';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src={kwiKwiLogo} alt="kwi kwi logo" className={styles.logoImage} />
          <span className={styles.logoText}>kwi kwi Admin</span>
        </div>
        
        <nav className={styles.nav}>
          <Link 
            to="/admin" 
            className={`${styles.navLink} ${location.pathname === '/admin' ? styles.active : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/admin/lessons" 
            className={`${styles.navLink} ${location.pathname.startsWith('/admin/lessons') ? styles.active : ''}`}
          >
            📚 Lecciones
          </Link>
          <Link to="/" className={styles.navLink}>
            🏠 Salir a la App
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h2 className={styles.pageTitle}>
            {location.pathname === '/admin' ? 'Dashboard' : 'Gestor de Lecciones'}
          </h2>
          <div className={styles.topbarActions}>
            <button onClick={toggleTheme} className={styles.themeToggle} title="Alternar tema">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
