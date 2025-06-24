import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/contexts/AuthContext';
import { User, Momentum, ActionRecord, Achievement } from '@/types/game';

export type UserData = User;

// Database schema type
interface DBUser {
  id: string;
  username: string | null;
  email: string | null;
  xp: number;
  streak: number;
  longest_streak: number;
  last_action_date: string | null;
  momentum: {
    multiplier: number;
    lastActionDate: string;
  };
  actions: ActionRecord[];
  achievements: Achievement[];
  stats: {
    execution: number;
    resilience: number;
    conviction: number;
    influence: number;
  };
}

const defaultUserData: UserData = {
  id: 'test-user',
  username: 'Test User',
  email: 'test@example.com',
  xp: 100,
  streak: 3,
  longestStreak: 5,
  lastActionDate: new Date().toISOString(),
  momentum: {
    multiplier: 1.5,
    lastActionDate: new Date().toISOString()
  },
  actions: [],
  achievements: [],
  stats: {
    execution: 75,
    resilience: 60,
    conviction: 80,
    influence: 65
  }
};

export interface ActionMetadata {
  category?: string;
  description?: string;
  [key: string]: any;
}

// Helper function to format database user to our app type
function formatDBUser(dbUser: DBUser): UserData {
  return {
    id: dbUser.id,
    username: dbUser.username || 'Anonymous Founder',
    email: dbUser.email || '',
    xp: dbUser.xp || 0,
    streak: dbUser.streak || 0,
    longestStreak: dbUser.longest_streak || 0,
    lastActionDate: dbUser.last_action_date || new Date().toISOString(),
    momentum: typeof dbUser.momentum === 'string' ? 
      JSON.parse(dbUser.momentum) : 
      (dbUser.momentum || {
        multiplier: 1.0,
        lastActionDate: new Date().toISOString()
      }),
    actions: typeof dbUser.actions === 'string' ? 
      JSON.parse(dbUser.actions) : 
      (dbUser.actions || []),
    achievements: typeof dbUser.achievements === 'string' ? 
      JSON.parse(dbUser.achievements) : 
      (dbUser.achievements || []),
    stats: typeof dbUser.stats === 'string' ? 
      JSON.parse(dbUser.stats) : 
      (dbUser.stats || {
        execution: 0,
        resilience: 0,
        conviction: 0,
        influence: 0
      })
  };
}

export function useUserData() {
  // Return default data immediately
  return {
    userData: defaultUserData,
    loading: false,
    error: null,
    updateUserData: async () => {},
    recordAction: async () => {}
  };
} 