export interface Action {
  id: string;
  name: string;
  description: string;
  xp: number;
  cooldown?: number; // in minutes
  icon?: string;
  category?: string;
}

export interface ActionRecord {
  id: string;
  actionId: string;
  timestamp: string;
  xp: number;
  multiplier: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActionDate: string;
  momentum: Momentum;
  actions: ActionRecord[];
  achievements: Achievement[];
}

export interface Momentum {
  multiplier: number;
  lastActionDate: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  date: string | null;
  icon?: string;
  requiredLevel?: number;
  requiredActions?: string[];
  requiredStreak?: number;
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
  {
    id: 'code',
    name: 'Write Code',
    description: 'Write some code for your project',
    xp: 10,
    cooldown: 5,
    icon: '💻',
    category: 'development'
  },
  {
    id: 'learn',
    name: 'Learn',
    description: 'Study something new',
    xp: 15,
    cooldown: 10,
    icon: '📚',
    category: 'growth'
  },
  {
    id: 'plan',
    name: 'Plan',
    description: 'Plan your next steps',
    xp: 5,
    icon: '📝',
    category: 'strategy'
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Connect with other founders',
    xp: 20,
    cooldown: 30,
    icon: '🤝',
    category: 'social'
  },
  {
    id: 'ship',
    name: 'Ship Feature',
    description: 'Deploy a new feature',
    xp: 50,
    icon: '🚀',
    category: 'development'
  },
  {
    id: 'customer',
    name: 'Customer Interview',
    description: 'Talk to a potential customer',
    xp: 30,
    icon: '👥',
    category: 'business'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_STEP',
    name: 'First Step',
    description: 'Complete your first action',
    unlocked: false,
    date: null,
    icon: '👣'
  },
  {
    id: 'CONSISTENCY_I',
    name: 'Consistency I',
    description: 'Maintain a 3-day streak',
    unlocked: false,
    date: null,
    icon: '🔥',
    requiredStreak: 3
  },
  {
    id: 'CONSISTENCY_II',
    name: 'Consistency II',
    description: 'Maintain a 7-day streak',
    unlocked: false,
    date: null,
    icon: '🔥🔥',
    requiredStreak: 7
  },
  {
    id: 'LEVEL_5',
    name: 'Getting Started',
    description: 'Reach level 5',
    unlocked: false,
    date: null,
    icon: '⭐',
    requiredLevel: 5
  },
  {
    id: 'LEVEL_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    unlocked: false,
    date: null,
    icon: '⭐⭐',
    requiredLevel: 10
  }
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

// Mock data for development
export const MOCK_USER_DATA: User = {
  id: 'mock-user-id',
  username: 'Solo Founder',
  email: 'founder@example.com',
  xp: 150,
  streak: 3,
  longestStreak: 5,
  lastActionDate: new Date().toISOString(),
  momentum: {
    multiplier: 1.2,
    lastActionDate: new Date().toISOString()
  },
  actions: [
    {
      id: 'mock-action-1',
      actionId: 'code',
      timestamp: new Date().toISOString(),
      xp: 10,
      multiplier: 1.2
    }
  ],
  achievements: ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: a.id === 'FIRST_STEP',
    date: a.id === 'FIRST_STEP' ? new Date().toISOString() : null
  }))
}; 