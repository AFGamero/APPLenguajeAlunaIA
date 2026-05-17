// ============================================================
// Kogui App — Página 404 Not Found
// ============================================================
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.body}>
          Esta ruta no existe en el territorio Kogui.
        </p>
        <Link to="/" className={styles.btn}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
