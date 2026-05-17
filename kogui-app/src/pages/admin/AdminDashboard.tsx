import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    lessonsCompleted: 0,
    totalXp: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: lessonsCount } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true });

        // Sum XP (Requires a bit of workaround if no sum aggregate, but we can just select all and reduce for prototype)
        const profileQuery: any = supabase.from('profiles');
        const { data: xpData } = await profileQuery.select('xp_total');
        const totalXp = xpData?.reduce((acc: number, curr: any) => acc + (curr.xp_total || 0), 0) || 0;

        setStats({
          users: usersCount || 0,
          lessonsCompleted: lessonsCount || 0,
          totalXp
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando estadísticas...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Usuarios Totales</span>
          <span className={styles.statValue}>{stats.users}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Lecciones Completadas</span>
          <span className={styles.statValue}>{stats.lessonsCompleted}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>XP Total en la Plataforma</span>
          <span className={styles.statValue}>{stats.totalXp}</span>
        </div>
      </div>
    </div>
  );
}
