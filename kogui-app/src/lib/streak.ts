// ============================================================
// Nebbi App — Utilidad de cálculo de racha (Streak)
// ============================================================

/**
 * Calcula la racha real actual basada en los días guardados en la BD
 * y la fecha de la última actividad.
 *
 * Reglas:
 * - Si lastActivity fue hoy o ayer: se mantiene la racha.
 * - Si lastActivity fue hace más de 1 día: la racha se rompió (retorna 0).
 * - Si lastActivity es null: retorna 0.
 *
 * @param streakDays - Los días de racha almacenados en la base de datos
 * @param lastActivity - Fecha ISO de la última lección completada (o null)
 * @returns La racha real actual
 */
export function calculateCurrentStreak(streakDays: number, lastActivity: string | null): number {
  if (!lastActivity || streakDays === 0) {
    return 0;
  }

  const now = new Date();
  const last = new Date(lastActivity);

  // Normalizar las fechas para comparar solo los días (ignorando horas)
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    // Si ha pasado más de 1 día (no fue hoy ni ayer), la racha se perdió
    return 0;
  }

  return streakDays;
}
