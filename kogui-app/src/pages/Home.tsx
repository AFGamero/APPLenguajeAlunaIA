import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Home.module.css';

interface ModuleData {
  id: string;
  title: string;
  description: string;
}

interface LessonData {
  id: string;
  title: string;
  order_index: number;
  xp_reward: number;
}

type LessonState = 'COMPLETED' | 'AVAILABLE' | 'LOCKED';

interface ExtendedLesson extends LessonData {
  state: LessonState;
}

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
        const { supabase } = await import('@/lib/supabaseClient');
        
        // 1. Obtener el Módulo 1 (orden = 1)
        const { data: moduleDataRaw, error: moduleError } = await supabase
          .from('modules')
          .select('id, title, description')
          .eq('order_index', 1)
          .single();

        if (moduleError) throw moduleError;
        const moduleData = moduleDataRaw as any;

        // 2. Obtener las lecciones del módulo
        const { data: lessonsDataRaw, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, title, order_index, xp_reward')
          .eq('module_id', moduleData.id)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        const lessonsData = lessonsDataRaw as any[];

        // 3. Obtener el progreso del usuario para este módulo
        const { data: progressDataRaw, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        const progressData = progressDataRaw as any[];

        const completedLessonIds = new Set(progressData.map((p: any) => p.lesson_id));

        // 4. Calcular el estado de cada lección (Desbloqueo progresivo)
        const extendedLessons: ExtendedLesson[] = lessonsData.map((lesson: any, index: number, arr: any[]) => {
          let state: LessonState = 'LOCKED';
          
          if (completedLessonIds.has(lesson.id)) {
            state = 'COMPLETED';
          } else if (
            index === 0 || // La primera siempre disponible si no está completada
            completedLessonIds.has(arr[index - 1].id) // Disponible si la anterior se completó
          ) {
            state = 'AVAILABLE';
          }

          return { ...lesson, state };
        });

        if (isMounted) {
          setModule(moduleData);
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
