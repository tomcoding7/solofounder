'use client';

import { useEffect, useState } from 'react';
import { User, Action, ACTIONS } from '@/types/game';
import { getDefaultUser, calculateLevel, updateStreak, updateMomentum, checkAchievements, calculateActionXP } from '@/utils/game';
import XPBar from '@/components/XPBar';
import FounderStats from '@/components/FounderStats';
import ActionButton from '@/components/ActionButton';
import Achievements from '@/components/Achievements';
import Momentum from '@/components/Momentum';
import Assistant from '@/components/Assistant';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function Home() {
  const [user, setUser] = useState<User>(getDefaultUser());
  const { playActionSound, playLevelUpSound } = useSoundEffects();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const isActionOnCooldown = (action: Action): boolean => {
    if (!action.cooldown) return false;

    const lastAction = user.actions
      .filter(a => a.actionId === action.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (!lastAction) return false;

    const now = new Date();
    const timeSinceLastAction = now.getTime() - new Date(lastAction.timestamp).getTime();
    const cooldownMs = action.cooldown * 60 * 1000;

    return timeSinceLastAction < cooldownMs;
  };

  const handleAction = (action: Action) => {
    const now = new Date();
    
    // Check cooldown
    if (isActionOnCooldown(action)) {
      return;
    }

    // Calculate XP with all multipliers
    const earnedXP = calculateActionXP(action, user);
    
    // Update user state
    const updatedUser = {
      ...user,
      xp: user.xp + earnedXP,
      actions: [
        ...user.actions,
        {
          id: crypto.randomUUID(),
          actionId: action.id,
          timestamp: now.toISOString(),
          xp: earnedXP,
          multiplier: user.momentum.multiplier,
        },
      ],
    };

    // Update streak and momentum
    const userWithStreak = updateStreak(updatedUser);
    const userWithMomentum = updateMomentum(userWithStreak);
    
    // Check achievements
    const finalUser = checkAchievements(userWithMomentum);

    // Check for level up
    const oldLevel = calculateLevel(user.xp);
    const newLevel = calculateLevel(finalUser.xp);
    
    if (newLevel > oldLevel) {
      playLevelUpSound();
    } else {
      playActionSound();
    }

    setUser(finalUser);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-6">
            <FounderStats user={user} />
            <Momentum momentum={user.momentum} />
          </div>

          {/* Center Column */}
          <div className="md:col-span-6 space-y-6">
            <XPBar
              level={calculateLevel(user.xp)}
              xp={user.xp}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIONS.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onClick={() => handleAction(action)}
                  disabled={isActionOnCooldown(action)}
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 space-y-6">
            <Achievements achievements={user.achievements} />
          </div>
        </div>
      </div>

      {/* Fixed Assistant */}
      <Assistant user={user} />
    </main>
  );
} 