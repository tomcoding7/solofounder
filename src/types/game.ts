export interface Action {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  cooldown?: number;
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
  xp: number;
  level: number;
  stats: Stats;
  achievements: Achievement[];
  actions: CompletedAction[];
  momentum: Momentum;
  lastActionDate: string;
}

export interface Momentum {
  streak: number;
  multiplier: number;
  lastActionDate: string;
  lastActionTimestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  unlocked: boolean;
  progress?: number;
  target?: number;
  requiredLevel?: number;
  date?: string;
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
  multiplier: number;
}

export interface Stats {
  strength: number;
  intelligence: number;
  dexterity: number;
  charisma: number;
}

export type FounderClass = 'Indie Hacker' | 'AI Builder' | 'Content Creator' | 'Community Leader';

export const ACTIONS: Action[] = [
  {
    id: 'code',
    name: 'Write Code',
    description: 'Write some code or fix a bug',
    icon: '💻',
    xp: 20,
    category: 'Development'
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Work on UI/UX design',
    icon: '🎨',
    xp: 15,
    category: 'Design'
  },
  {
    id: 'learn',
    name: 'Learn',
    description: 'Study a new technology or concept',
    icon: '📚',
    xp: 10,
    category: 'Learning'
  },
  {
    id: 'plan',
    name: 'Plan',
    description: 'Plan features or architecture',
    icon: '📝',
    xp: 10,
    category: 'Planning'
  },
  {
    id: 'test',
    name: 'Test',
    description: 'Write or run tests',
    icon: '🧪',
    xp: 15,
    category: 'Testing'
  },
  {
    id: 'deploy',
    name: 'Deploy',
    description: 'Deploy code to production',
    icon: '🚀',
    xp: 25,
    category: 'Operations'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-action',
    name: 'First Step',
    description: 'Complete your first founder action',
    icon: '🎯',
    completed: false,
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'level-2',
    name: 'Rising Star',
    description: 'Reach Level 2',
    icon: '⭐',
    completed: false,
    unlocked: false,
    requiredLevel: 2
  },
  {
    id: 'level-5',
    name: 'Emerging Leader',
    description: 'Reach Level 5',
    icon: '🌟',
    completed: false,
    unlocked: false,
    requiredLevel: 5
  }
];

export const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0-99 XP
  100,   // Level 2: 100-299 XP
  300,   // Level 3: 300-599 XP
  600,   // Level 4: 600-999 XP
  1000,  // Level 5: 1000-1499 XP
  1500,  // Level 6: 1500-2099 XP
  2100,  // Level 7: 2100-2799 XP
  2800,  // Level 8: 2800-3599 XP
  3600,  // Level 9: 3600-4499 XP
  4500,  // Level 10: 4500+ XP
] as const;

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
  id: 'mock-user',
  username: 'Solo Founder',
  xp: 0,
  level: 1,
  stats: {
    strength: 5,
    intelligence: 7,
    dexterity: 4,
    charisma: 6
  },
  achievements: [
    {
      id: 'first-action',
      name: 'First Step',
      description: 'Complete your first founder action',
      icon: '🎯',
      completed: false,
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'level-2',
      name: 'Rising Star',
      description: 'Reach Level 2',
      icon: '⭐',
      completed: false,
      unlocked: false,
      requiredLevel: 2
    },
    {
      id: 'level-5',
      name: 'Emerging Leader',
      description: 'Reach Level 5',
      icon: '🌟',
      completed: false,
      unlocked: false,
      requiredLevel: 5
    }
  ],
  actions: [],
  momentum: {
    streak: 0,
    multiplier: 1,
    lastActionDate: '',
    lastActionTimestamp: ''
  },
  lastActionDate: ''
}; 