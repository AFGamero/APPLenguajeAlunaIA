// ============================================================
// Kogui App — Página Lesson (placeholder Sprint 0)
// Se implementa completamente en T-02-03
// ============================================================
import { useParams, Link } from 'react-router-dom';
import styles from './Lesson.module.css';

export default function Lesson() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className={styles.page}>
      <div className="container container--md">
        <Link to="/" className={styles.back}>
          ← Volver al módulo
        </Link>
        <div className={styles.placeholder}>
          <span className={styles.icon}>📚</span>
          <h1 className={styles.title}>Lección</h1>
          <p className={styles.id}>ID: {id}</p>
          <p className={styles.note}>Disponible en Sprint 2</p>
        </div>
      </div>
    </main>
  );
}
