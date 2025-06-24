export interface Action {
  id: string;
  name: string;
  xp: number;
  icon: string;
  description?: string;
  cooldown?: number; // in minutes
}

export interface User {
  xp: number;
  level: number;
  actions: CompletedAction[];
  streak: number;
  lastActionDate: string | null;
  class: FounderClass;
  stats: FounderStats;
  momentum: Momentum;
  achievements: Achievement[];
  questProgress: QuestProgress;
}

export interface Momentum {
  multiplier: number;
  lastActionTimestamp: string | null;
  isActive: boolean;
  streakDays: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  timestamp?: string;
}

export interface QuestProgress {
  dailyQuestsCompleted: number;
  weeklyQuestsCompleted: number;
  currentQuests: Quest[];
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  name: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  expiresAt: string;
}

export interface CompletedAction {
  id: string;
  actionId: string;
  timestamp: string;
  xp: number;
  multiplier?: number;
}

export interface FounderStats {
  execution: number;
  resilience: number;
  conviction: number;
  influence: number;
}

export type FounderClass = 'Indie Hacker' | 'AI Builder' | 'Content Creator' | 'Community Leader';

export const ACTIONS: Action[] = [
  { id: 'post', name: 'Post Content', xp: 10, icon: '📝', description: 'Share valuable content online' },
  { id: 'dm', name: 'Cold DM/Email', xp: 20, icon: '💬', description: 'Reach out for collaboration' },
  { id: 'approach', name: 'Cold Approach IRL', xp: 30, icon: '🤝', description: 'Network in person' },
  { id: 'reject', name: 'Get Rejected', xp: 15, icon: '🎯', description: 'Learn from rejection' },
  { id: 'ship', name: 'Ship MVP', xp: 100, icon: '🚀', description: 'Launch a product/feature', cooldown: 180 },
  { id: 'fail', name: 'Fail & Reflect', xp: 25, icon: '🔄', description: 'Learn from mistakes' },
  { id: 'gym', name: 'Go to Gym', xp: 15, icon: '💪', description: 'Stay healthy', cooldown: 720 },
  { id: 'help', name: 'Make Someone\'s Day', xp: 20, icon: '🌟', description: 'Help others succeed' },
  { id: 'quest', name: 'Complete Quest', xp: 50, icon: '✨', description: 'Finish daily challenge' },
];

export const ACHIEVEMENTS = [
  {
    id: 'rejection_proof',
    name: 'Rejection-Proof',
    description: 'Get rejected 10 times in a week',
    target: 10,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Ship MVP in under 3 hours',
    target: 1,
  },
  {
    id: 'social_hacker',
    name: 'Social Hacker',
    description: 'Cold-approach 5 people in a day',
    target: 5,
  },
  {
    id: 'momentum_beast',
    name: 'Momentum Beast',
    description: 'Maintain a 30-day streak',
    target: 30,
  },
];

export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2100,  // Level 7
  2800,  // Level 8
  3600,  // Level 9
  4500,  // Level 10
];

export const LEVEL_TITLES = [
  'Apprentice',
  'Operator',
  'Founder',
  'Innovator',
  'Rainmaker',
  'Tycoon',
  'Mogul',
  'Legend',
  'Empire Builder',
  'Tech Titan',
];

export const FOUNDER_CLASSES: Record<FounderClass, { description: string; bonuses: string[] }> = {
  'Indie Hacker': {
    description: 'A solo developer building products and automating systems',
    bonuses: [
      'Ship Product/Landing Page XP +20%',
      'Execution stat growth +10%',
    ],
  },
  'AI Builder': {
    description: 'Leveraging AI to create innovative solutions',
    bonuses: [
      'All XP gains +10%',
      'Resilience stat growth +15%',
    ],
  },
  'Content Creator': {
    description: 'Building in public and sharing knowledge',
    bonuses: [
      'Post Content XP +30%',
      'Influence stat growth +20%',
    ],
  },
  'Community Leader': {
    description: 'Growing and nurturing communities',
    bonuses: [
      'Cold DM XP +25%',
      'Conviction stat growth +15%',
    ],
  },
}; 