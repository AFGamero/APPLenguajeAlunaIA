import { supabase } from './supabaseClient';

export async function saveProgress(userId: string, lessonId: string, score: number, total: number, xpReward: number) {
  // 1. Calcular XP ganado basado en la precisión
  const precision = total > 0 ? score / total : 0;
  const xpEarned = Math.round(precision * xpReward);

  // 2. Guardar en user_progress (upsert por si ya la había completado, aunque no hemos definido unique constraint, es seguro intentar insert)
  // Nota: En un sistema real verificaríamos si ya ganó el XP para no sumarlo doble en el perfil.
  // Para este prototipo, vamos a verificar si ya existe.
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (!existingProgress) {
    const progressQuery: any = supabase.from('user_progress');
    const { error: progressError } = await progressQuery.insert({
      user_id: userId,
      lesson_id: lessonId,
      score: score,
      xp_earned: xpEarned
    });

    if (progressError) throw progressError;

    // Solo sumamos XP al perfil si es la PRIMERA vez que completa la lección
    const { data: profileRaw, error: profileGetError } = await supabase
      .from('profiles')
      .select('xp_total, last_activity, streak_days')
      .eq('id', userId)
      .single();

    if (profileGetError) throw profileGetError;
    const profile = profileRaw as any;

    const now = new Date();
    const lastActivityDate = profile.last_activity ? new Date(profile.last_activity) : null;
    
    // Cálculo básico de racha
    let newStreak = profile.streak_days || 0;
    if (!lastActivityDate) {
      newStreak = 1;
    } else {
      const todayStr = now.toISOString().split('T')[0];
      const lastStr = lastActivityDate.toISOString().split('T')[0];
      
      if (todayStr !== lastStr) {
         const msPerDay = 1000 * 60 * 60 * 24;
         const diffDays = Math.round((new Date(todayStr).getTime() - new Date(lastStr).getTime()) / msPerDay);
         
         if (diffDays === 1) {
           newStreak += 1;
         } else if (diffDays > 1) {
           newStreak = 1;
         }
      }
    }

    const profileUpdateQuery: any = supabase.from('profiles');
    const { error: profileUpdateError } = await profileUpdateQuery
      .update({
        xp_total: (profile.xp_total || 0) + xpEarned,
        last_activity: now.toISOString(),
        streak_days: newStreak
      })
      .eq('id', userId);

    if (profileUpdateError) throw profileUpdateError;
  }

  return { xpEarned, precision: Math.round(precision * 100), isFirstTime: !existingProgress };
}
