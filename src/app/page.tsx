'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Action, ACTIONS } from '@/types/game';
import { calculateLevel, updateStreak, updateMomentum, checkAchievements, calculateActionXP } from '@/utils/game';
import XPBar from '@/components/XPBar';
import FounderStats from '@/components/FounderStats';
import ActionButton from '@/components/ActionButton';
import Achievements from '@/components/Achievements';
import Momentum from '@/components/Momentum';
import Assistant from '@/components/Assistant';
import Leaderboard from '@/components/Leaderboard';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { gameUser, loading, updateUserData, recordAction } = useUserData();
  const { playActionSound, playLevelUpSound } = useSoundEffects();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAction = async (action: Action) => {
    if (!gameUser) return;

    const now = new Date();
    
    // Check cooldown
    if (isActionOnCooldown(action)) {
      return;
    }

    // Calculate XP with all multipliers
    const earnedXP = calculateActionXP(action, gameUser);
    
    // Record action and update user data
    const updatedUser = {
      ...gameUser,
      xp: gameUser.xp + earnedXP,
      actions: [
        ...gameUser.actions,
        {
          id: crypto.randomUUID(),
          actionId: action.id,
          timestamp: now.toISOString(),
          xp: earnedXP,
          multiplier: gameUser.momentum.multiplier,
        },
      ],
    };

    // Update streak and momentum
    const userWithStreak = updateStreak(updatedUser);
    const userWithMomentum = updateMomentum(userWithStreak);
    
    // Check achievements
    const finalUser = checkAchievements(userWithMomentum);

    // Check for level up
    const oldLevel = calculateLevel(gameUser.xp);
    const newLevel = calculateLevel(finalUser.xp);
    
    if (newLevel > oldLevel) {
      playLevelUpSound();
    } else {
      playActionSound();
    }

    // Save to database
    await recordAction(action.id, earnedXP, gameUser.momentum.multiplier);
    await updateUserData(finalUser);
  };

  const isActionOnCooldown = (action: Action): boolean => {
    if (!action.cooldown || !gameUser) return false;

    const lastAction = gameUser.actions
      .filter(a => a.actionId === action.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (!lastAction) return false;

    const now = new Date();
    const timeSinceLastAction = now.getTime() - new Date(lastAction.timestamp).getTime();
    const cooldownMs = action.cooldown * 60 * 1000;

    return timeSinceLastAction < cooldownMs;
  };

  if (!gameUser || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-purple-300 text-xl font-orbitron">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-6">
            <FounderStats user={gameUser} />
            <Momentum momentum={gameUser.momentum} />
            <Leaderboard />
          </div>

          {/* Center Column */}
          <div className="md:col-span-6 space-y-6">
            <XPBar
              level={calculateLevel(gameUser.xp)}
              xp={gameUser.xp}
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
            <Achievements achievements={gameUser.achievements} />
          </div>
        </div>
      </div>

      {/* Fixed Assistant */}
      <Assistant user={gameUser} />
    </main>
  );
} 