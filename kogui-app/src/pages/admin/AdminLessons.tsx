import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import styles from './AdminLessons.module.css';

interface Module {
  id: string;
  title: string;
  order_index: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  xp_reward: number;
}

export default function AdminLessons() {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const modulesQuery: any = supabase.from('modules');
        const lessonsQuery: any = supabase.from('lessons');

        const [modulesRes, lessonsRes] = await Promise.all([
          modulesQuery.select('*').order('order_index'),
          lessonsQuery.select('id, module_id, title, order_index, xp_reward').order('order_index')
        ]);

        if (modulesRes.data) setModules(modulesRes.data);
        if (lessonsRes.data) setLessons(lessonsRes.data);
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
      const lessonsQuery: any = supabase.from('lessons');
      const { error } = await lessonsQuery.delete().eq('id', lessonId);
      if (error) throw error;
      setLessons(lessons.filter(l => l.id !== lessonId));
    } catch (err: any) {
      alert(`Error eliminando la lección: ${err.message}`);
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
