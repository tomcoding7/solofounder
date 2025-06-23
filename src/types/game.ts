export interface Action {
  id: string;
  name: string;
  xp: number;
  icon: string;
}

export interface User {
  xp: number;
  level: number;
  actions: CompletedAction[];
  streak: number;
  lastActionDate: string | null;
}

export interface CompletedAction {
  id: string;
  actionId: string;
  timestamp: string;
  xp: number;
}

export const ACTIONS: Action[] = [
  { id: 'post', name: 'Post Content', xp: 10, icon: '📝' },
  { id: 'dm', name: 'Cold DM for Collab', xp: 20, icon: '💬' },
  { id: 'gym', name: 'Go to Gym', xp: 15, icon: '💪' },
  { id: 'ship', name: 'Ship Product/Landing Page', xp: 100, icon: '🚀' },
  { id: 'sale', name: 'Get Sale/Reply', xp: 50, icon: '💰' },
  { id: 'reject', name: 'Get Rejected', xp: 15, icon: '🎯' },
];

export const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  300,  // Level 3
  600,  // Level 4
  1000, // Level 5
  1500, // Level 6
  2100, // Level 7
  2800, // Level 8
  3600, // Level 9
  4500, // Level 10
];

export const LEVEL_TITLES = [
  'Apprentice',
  'Operator',
  'Closer',
  'Founder',
  'Rainmaker',
  'Millionaire',
  'Legend',
  'Titan',
  'Mogul',
  'Empire Builder',
]; 