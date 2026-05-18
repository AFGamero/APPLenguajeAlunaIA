import { apiClient } from './apiClient';

export async function saveProgress(lessonId: string, score: number, total: number, xpReward: number) {
  const precision = total > 0 ? score / total : 0;
  const xpEarned = Math.round(precision * xpReward);
  const existingProgress = await apiClient.progress.list();
  const isFirstTime = !existingProgress.items.some((item) => item.lesson_id === lessonId);

  await apiClient.progress.save({
      lesson_id: lessonId,
      score,
      xp_earned: xpEarned,
  });

  return { xpEarned, precision: Math.round(precision * 100), isFirstTime };
}
