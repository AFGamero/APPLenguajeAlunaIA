// ============================================================
// Nebbi App — Página Profile
// Muestra progreso, XP y racha del usuario
// ============================================================
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { calculateCurrentStreak } from '@/lib/streak';
import styles from './Profile.module.css';

interface ProfileData {
  xp_total: number;
  streak_days: number;
  last_activity: string | null;
}

interface ProgressHistory {
  id: string;
  completed_at: string;
  score: number;
  xp_earned: number;
  lessons: {
    title: string;
  };
}

export default function Profile() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<ProgressHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadProfile() {
      if (!user) return;
      try {
        const { supabase } = await import('@/lib/supabaseClient');
        
        // Cargar perfil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('xp_total, streak_days, last_activity')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Cargar historial
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            id,
            completed_at,
            score,
            xp_earned,
            lessons ( title )
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (progressError) throw progressError;

        if (isMounted) {
          setProfile(profileData);
          setHistory(progressData as any);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error cargando perfil:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar los datos');
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container container--md" style={{ textAlign: 'center', padding: '4rem' }}>
           <div className={styles.loader}></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className="container container--md">
           <div className={styles.errorBox}>{error}</div>
        </div>
      </main>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuario';
  const initial = userName.charAt(0).toUpperCase();
  
  const realStreak = profile ? calculateCurrentStreak(profile.streak_days, profile.last_activity) : 0;

  return (
    <main className={styles.page}>
      <div className="container container--md">
        <header className={styles.header}>
          <div className={styles.avatar}>{initial}</div>
          <div>
            <h1 className={styles.name}>{userName}</h1>
            <p className={styles.sub}>Estudiante de Nebbi</p>
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>⚡</span>
            <span className={styles.statValue}>{profile?.xp_total || 0}</span>
            <span className={styles.statLabel}>XP Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>🔥</span>
            <span className={styles.statValue}>{realStreak}</span>
            <span className={styles.statLabel}>Días de Racha</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>📖</span>
            <span className={styles.statValue}>{history.length}</span>
            <span className={styles.statLabel}>Lecciones</span>
          </div>
        </div>

        <section className={styles.historySection}>
          <h2 className={styles.historyTitle}>Historial de lecciones</h2>
          {history.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Aún no has completado ninguna lección.</p>
              <span>¡Empieza a aprender hoy para sumar puntos!</span>
            </div>
          ) : (
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyItemMain}>
                    <span className={styles.lessonTitle}>{item.lessons?.title || 'Lección'}</span>
                    <span className={styles.lessonDate}>
                      {new Date(item.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.historyItemStats}>
                    <span className={styles.scoreBadge}>Puntaje: {item.score}</span>
                    <span className={styles.xpBadge}>+{item.xp_earned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
