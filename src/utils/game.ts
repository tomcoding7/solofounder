import { User, LEVEL_THRESHOLDS, LEVEL_TITLES } from '@/types/game';

export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

export const calculateProgress = (xp: number): number => {
  const level = calculateLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[level - 1] + 1000;
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const getLevelTitle = (level: number): string => {
  return LEVEL_TITLES[level - 1] || LEVEL_TITLES[LEVEL_TITLES.length - 1];
};

export const updateStreak = (user: User): User => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = user.lastActionDate;

  if (!lastDate) {
    return { ...user, streak: 1, lastActionDate: today };
  }

  const lastActionDate = new Date(lastDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (today === lastDate) {
    return user;
  } else if (lastDate === yesterday.toISOString().split('T')[0]) {
    return { ...user, streak: user.streak + 1, lastActionDate: today };
  } else {
    return { ...user, streak: 1, lastActionDate: today };
  }
};

export const getDefaultUser = (): User => ({
  xp: 0,
  level: 1,
  actions: [],
  streak: 0,
  lastActionDate: null,
}); 