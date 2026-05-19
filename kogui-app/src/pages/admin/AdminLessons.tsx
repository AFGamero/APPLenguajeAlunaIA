import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Link } from 'react-router-dom';
import type { AdminLessonListItem, AdminModule } from '@/types/api';
import styles from './AdminLessons.module.css';

export default function AdminLessons() {
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [lessons, setLessons] = useState<AdminLessonListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [modulesRes, lessonsRes] = await Promise.all([
          apiClient.admin.modules(),
          apiClient.admin.lessons(),
        ]);

        setModules(modulesRes);
        setLessons(lessonsRes);
      } catch (err) {
        console.error('Error fetching lessons data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (lessonId: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la lección "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await apiClient.admin.deleteLesson(lessonId);
      setLessons(lessons.filter(l => l.id !== lessonId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      alert(`Error eliminando la lección: ${message}`);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando lecciones...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.subtitle}>Gestión de Contenido</h3>
        <Link to="/admin/lessons/new" className={styles.createBtn}>+ Nueva Lección</Link>
      </div>

      <div className={styles.modulesList}>
        {modules.map(mod => (
          <div key={mod.id} className={styles.moduleCard}>
            <div className={styles.moduleHeader}>
              <h4>Módulo {mod.order_index}: {mod.title}</h4>
            </div>
            <ul className={styles.lessonList}>
              {lessons.filter(l => l.module_id === mod.id).map(lesson => (
                <li key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <span className={styles.lessonTitle}>{lesson.order_index}. {lesson.title}</span>
                    <span className={styles.lessonXp}>{lesson.xp_reward} XP</span>
                  </div>
                  <div className={styles.lessonActions}>
                    <Link to={`/admin/lessons/edit/${lesson.id}`} className={styles.editBtn}>Editar</Link>
                    <button onClick={() => handleDelete(lesson.id, lesson.title)} className={styles.deleteBtn}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
              {lessons.filter(l => l.module_id === mod.id).length === 0 && (
                <p className={styles.emptyText}>No hay lecciones en este módulo.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
