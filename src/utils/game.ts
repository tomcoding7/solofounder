import { User, LEVEL_THRESHOLDS, LEVEL_TITLES, FounderClass, FOUNDER_CLASSES, Action, ACHIEVEMENTS } from '@/types/game';

export function calculateLevel(xp: number): number {
  // Debug log
  console.log('Calculating level for XP:', xp);
  console.log('Level thresholds:', LEVEL_THRESHOLDS);
  
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  // Debug log
  console.log('Calculated level:', level);
  return level;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

export function calculateProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevel];
  
  if (!nextLevelThreshold) {
    return 100; // Max level reached
  }
  
  const xpInCurrentLevel = currentXP - currentLevelThreshold;
  const xpRequiredForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progress = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

export const getLevelTitle = (level: number): string => {
  return LEVEL_TITLES[level - 1] || LEVEL_TITLES[LEVEL_TITLES.length - 1];
};

export const updateMomentum = (user: User): User => {
  const now = new Date();
  const lastAction = user.momentum.lastActionTimestamp 
    ? new Date(user.momentum.lastActionTimestamp)
    : null;

  // Reset momentum if more than 48 hours have passed
  if (lastAction && (now.getTime() - lastAction.getTime()) > 48 * 60 * 60 * 1000) {
    return {
      ...user,
      momentum: {
        multiplier: 1,
        lastActionTimestamp: now.toISOString(),
        isActive: false,
        streakDays: 0,
      },
    };
  }

  // Increase momentum if within 24 hours
  if (lastAction && (now.getTime() - lastAction.getTime()) <= 24 * 60 * 60 * 1000) {
    const newMultiplier = Math.min(1.5, 1 + (user.momentum.streakDays * 0.1));
    return {
      ...user,
      momentum: {
        ...user.momentum,
        multiplier: newMultiplier,
        lastActionTimestamp: now.toISOString(),
        isActive: true,
        streakDays: user.momentum.streakDays + 1,
      },
    };
  }

  return user;
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

export const checkAchievements = (user: User): User => {
  const achievements = [...user.achievements];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Check Rejection-Proof
  const weeklyRejections = user.actions.filter(a => 
    a.actionId === 'reject' && 
    new Date(a.timestamp) > weekAgo
  ).length;
  
  const rejectionAchievement = achievements.find(a => a.id === 'rejection_proof');
  if (rejectionAchievement) {
    rejectionAchievement.progress = weeklyRejections;
    rejectionAchievement.completed = weeklyRejections >= 10;
  }

  // Check Social Hacker
  const todayApproaches = user.actions.filter(a => 
    a.actionId === 'approach' && 
    new Date(a.timestamp).toDateString() === now.toDateString()
  ).length;

  const socialAchievement = achievements.find(a => a.id === 'social_hacker');
  if (socialAchievement) {
    socialAchievement.progress = todayApproaches;
    socialAchievement.completed = todayApproaches >= 5;
  }

  // Check Momentum Beast
  const momentumAchievement = achievements.find(a => a.id === 'momentum_beast');
  if (momentumAchievement) {
    momentumAchievement.progress = user.momentum.streakDays;
    momentumAchievement.completed = user.momentum.streakDays >= 30;
  }

  return { ...user, achievements };
};

export const calculateActionXP = (action: Action, user: User): number => {
  const baseXP = action.xp;
  const momentumMultiplier = user.momentum.isActive ? user.momentum.multiplier : 1;
  let classMultiplier = 1;

  // Apply class-specific bonuses
  if (user.class === 'AI Builder') {
    classMultiplier += 0.1; // +10% to all XP gains
  } else if (user.class === 'Content Creator' && action.id === 'post') {
    classMultiplier += 0.3; // +30% to Post Content XP
  } else if (user.class === 'Community Leader' && action.id === 'dm') {
    classMultiplier += 0.25; // +25% to Cold DM XP
  } else if (user.class === 'Indie Hacker' && action.id === 'ship') {
    classMultiplier += 0.2; // +20% to Ship Product XP
  }

  return Math.floor(baseXP * momentumMultiplier * classMultiplier);
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
  id: 'new-user',
  username: 'New User',
  email: '',
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastActionDate: new Date().toISOString(),
  momentum: {
    multiplier: 1.0,
    lastActionDate: new Date().toISOString(),
    lastActionTimestamp: new Date().toISOString(),
    isActive: false,
    streakDays: 0
  },
  actions: [],
  achievements: [],
  stats: {
    execution: 1,
    resilience: 1,
    conviction: 1,
    influence: 1
  },
  class: 'Indie Hacker'
}); 