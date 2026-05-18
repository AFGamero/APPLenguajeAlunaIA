import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import type { ModuleResponse } from '@/types/api';
import styles from './Home.module.css';

type LessonState = 'COMPLETED' | 'AVAILABLE' | 'LOCKED';

interface ModuleData {
  id: string;
  title: string;
  description: string;
}

type ExtendedLesson = ModuleResponse['lessons'][number] & {
  state: LessonState;
};

export default function Home() {
  const { user } = useAuth();
  
  const [module, setModule] = useState<ModuleData | null>(null);
  const [lessons, setLessons] = useState<ExtendedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadLearningPath() {
      if (!user) return;
      try {
        const [modulesData, progressData] = await Promise.all([
          apiClient.modules.list(),
          apiClient.progress.list(),
        ]);
        const moduleData = modulesData.find((item) => item.order_index === 1);
        if (!moduleData) {
          throw new Error('Módulo no encontrado');
        }

        const completedLessonIds = new Set(progressData.items.map((item) => item.lesson_id));

        const extendedLessons: ExtendedLesson[] = moduleData.lessons.map((lesson, index, arr) => {
          let state: LessonState = 'LOCKED';

          if (completedLessonIds.has(lesson.id)) {
            state = 'COMPLETED';
          } else if (
            index === 0 ||
            completedLessonIds.has(arr[index - 1].id)
          ) {
            state = 'AVAILABLE';
          }

          return { ...lesson, state };
        });

        if (isMounted) {
          setModule({
            id: moduleData.id,
            title: moduleData.title,
            description: moduleData.description || '',
          });
          setLessons(extendedLessons);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error cargando el mapa de aprendizaje:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar las lecciones');
          setLoading(false);
        }
      }
    }

    loadLearningPath();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLessonClick = (e: React.MouseEvent, lesson: ExtendedLesson) => {
    if (lesson.state === 'LOCKED') {
      e.preventDefault();
      alert('🔒 Completa la lección anterior para desbloquear esta misión.');
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container container--sm" style={{ textAlign: 'center', padding: '4rem' }}>
           <div className={styles.loader}></div>
        </div>
      </main>
    );
  }

  if (error || !module) {
    return (
      <main className={styles.page}>
        <div className="container container--sm">
           <div className={styles.errorBox}>{error || 'Módulo no encontrado'}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>Módulo 1</div>
        <h1 className={styles.title}>{module.title}</h1>
        <p className={styles.subtitle}>{module.description}</p>
      </div>

      <div className={styles.pathContainer}>
        {lessons.map((lesson, index) => {
          const isCompleted = lesson.state === 'COMPLETED';
          const isAvailable = lesson.state === 'AVAILABLE';
          const isLocked = lesson.state === 'LOCKED';
          
          // Desplazamiento en zigzag para el mapa de ruta
          const xOffset = index % 2 === 0 ? '-20px' : '20px';

          return (
            <div key={lesson.id} className={styles.nodeWrapper}>
              {/* Conector (Línea hacia la siguiente lección) */}
              {index < lessons.length - 1 && (
                <div className={`${styles.connector} ${isCompleted ? styles.connectorCompleted : ''}`} />
              )}
              
              <Link
                to={`/lesson/${lesson.id}`}
                onClick={(e) => handleLessonClick(e, lesson)}
                className={`${styles.lessonNode} ${
                  isCompleted ? styles.completed : isAvailable ? styles.available : styles.locked
                }`}
                style={{ transform: `translateX(${xOffset})` }}
              >
                <div className={styles.nodeIcon}>
                  {isCompleted && '✓'}
                  {isAvailable && '►'}
                  {isLocked && '🔒'}
                </div>
                
                <div className={styles.lessonCard}>
                  <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                  <div className={styles.lessonMeta}>
                    <span className={styles.lessonNumber}>Lección {lesson.order_index}</span>
                    <span className={styles.xpReward}>+{lesson.xp_reward} XP</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
