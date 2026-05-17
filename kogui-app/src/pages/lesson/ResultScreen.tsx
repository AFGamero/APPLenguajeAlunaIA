import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { saveProgress } from '@/lib/progress';
import styles from './ResultScreen.module.css';

interface Props {
  lessonId: string;
  score: number;
  total: number;
  xpReward: number;
}

export default function ResultScreen({ lessonId, score, total, xpReward }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [saving, setSaving] = useState(true);
  const [stats, setStats] = useState<{ xpEarned: number, precision: number, isFirstTime: boolean } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function save() {
      if (!user) return;
      try {
        const result = await saveProgress(user.id, lessonId, score, total, xpReward);
        if (isMounted) setStats(result);
      } catch (err) {
        console.error('Error guardando el progreso:', err);
      } finally {
        if (isMounted) setSaving(false);
      }
    }
    save();
    return () => { isMounted = false; };
  }, [user, lessonId, score, total, xpReward]);

  if (saving) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Guardando tu progreso...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} animate-bounceIn`}>
      <div className={styles.iconContainer}>
        ⭐
      </div>
      <h1 className={styles.title}>¡Misión Cumplida!</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>XP Ganado</span>
          <span className={styles.statValue}>
            +{stats?.isFirstTime ? stats?.xpEarned : 0}
          </span>
          {!stats?.isFirstTime && <p className={styles.smallText}>(Lección ya completada antes)</p>}
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Precisión</span>
          <span className={styles.statValue}>{stats?.precision || 0}%</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryBtn} 
          onClick={() => navigate('/')}
        >
          Volver al Mapa
        </button>
      </div>
    </div>
  );
}
