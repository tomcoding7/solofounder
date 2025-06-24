import { User, LEVEL_THRESHOLDS, LEVEL_TITLES, FounderClass, FOUNDER_CLASSES, Action } from '@/types/game';

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

export const calculateActionXP = (action: Action, founderClass: FounderClass): number => {
  const bonuses = FOUNDER_CLASSES[founderClass].bonuses;
  let xpMultiplier = 1;

  // Apply class-specific bonuses
  if (founderClass === 'AI Builder') {
    xpMultiplier += 0.1; // +10% to all XP gains
  } else if (founderClass === 'Content Creator' && action.id === 'post') {
    xpMultiplier += 0.3; // +30% to Post Content XP
  } else if (founderClass === 'Community Leader' && action.id === 'dm') {
    xpMultiplier += 0.25; // +25% to Cold DM XP
  } else if (founderClass === 'Indie Hacker' && action.id === 'ship') {
    xpMultiplier += 0.2; // +20% to Ship Product XP
  }

  return Math.floor(action.xp * xpMultiplier);
};

export const updateStats = (user: User, actionId: string): User => {
  const stats = { ...user.stats };
  
  // Update stats based on action type
  switch (actionId) {
    case 'ship':
      stats.execution += 2;
      break;
    case 'reject':
      stats.resilience += 2;
      break;
    case 'post':
      stats.influence += 1;
      break;
    case 'dm':
      stats.influence += 1;
      stats.conviction += 1;
      break;
    case 'sale':
      stats.execution += 1;
      stats.influence += 2;
      break;
    default:
      break;
  }

  // Apply class-specific stat bonuses
  const classBonus = 0.15; // 15% bonus
  switch (user.class) {
    case 'Indie Hacker':
      stats.execution = Math.floor(stats.execution * (1 + classBonus));
      break;
    case 'AI Builder':
      stats.resilience = Math.floor(stats.resilience * (1 + classBonus));
      break;
    case 'Content Creator':
      stats.influence = Math.floor(stats.influence * (1 + classBonus));
      break;
    case 'Community Leader':
      stats.conviction = Math.floor(stats.conviction * (1 + classBonus));
      break;
  }

  return { ...user, stats };
};

export const getDefaultUser = (): User => ({
  xp: 0,
  level: 1,
  actions: [],
  streak: 0,
  lastActionDate: null,
  class: 'Indie Hacker',
  stats: {
    execution: 1,
    resilience: 1,
    conviction: 1,
    influence: 1,
  },
}); 