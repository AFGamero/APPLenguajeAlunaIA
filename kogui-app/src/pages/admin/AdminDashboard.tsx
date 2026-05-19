import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
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
        const data = await apiClient.admin.stats();
        setStats({
          users: data.users,
          lessonsCompleted: data.lessons_completed,
          totalXp: data.total_xp,
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
