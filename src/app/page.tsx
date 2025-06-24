'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Action, ACTIONS, MOCK_USER_DATA, User } from '@/types/game';
import { calculateLevel } from '@/utils/game';
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
  const { userData: realUserData, loading, error } = useUserData();
  const { playXP, playLevelUp } = useSoundEffects();
  const [mockUserData, setMockUserData] = useState<User>(MOCK_USER_DATA);

  // Use mock data if no real data is available
  const userData: User = realUserData || mockUserData;
  const currentLevel = calculateLevel(userData.xp);

  // Temporarily disable authentication redirect
  /*
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);
  */

  const handleAction = async (action: Action) => {
    // Always use mock mode for now
    setMockUserData(prevUser => {
      const newXP = prevUser.xp + action.xp;
      const oldLevel = calculateLevel(prevUser.xp);
      const newLevel = calculateLevel(newXP);
      
      // Play level up sound if leveled up
      if (newLevel > oldLevel) {
        playLevelUp();
      }

      // Create updated user data
      const updatedUser = {
        ...prevUser,
        xp: newXP,
        actions: [
          ...prevUser.actions,
          {
            id: Math.random().toString(36).substr(2, 9),
            actionId: action.id,
            timestamp: new Date().toISOString(),
            xp: action.xp,
            multiplier: prevUser.momentum.multiplier
          }
        ]
      };

      // Update achievements for level-based achievements
      const achievements = updatedUser.achievements.map(achievement => {
        if (achievement.requiredLevel && newLevel >= achievement.requiredLevel) {
          return {
            ...achievement,
            completed: true,
            unlocked: true,
            progress: newLevel,
            date: new Date().toISOString()
          };
        }
        return achievement;
      });

      return {
        ...updatedUser,
        achievements
      };
    });
  };

  // Show loading state only when we're expecting real user data
  if (user && loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-t-2 border-purple-500 border-solid rounded-full animate-spin mx-auto"></div>
          <div className="text-purple-300 text-xl">
            Loading your progress...
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-orbitron text-purple-300">
            {userData.username || 'Solo Founder'}
          </h1>
          <button
            onClick={() => router.push('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 space-y-6">
            <FounderStats user={userData} />
            <Momentum momentum={userData.momentum} />
            <Leaderboard currentUser={userData} />
          </div>

          <div className="md:col-span-6 space-y-6">
            <XPBar
              level={currentLevel}
              xp={userData.xp}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIONS.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onClick={() => handleAction(action)}
                  disabled={false} // Disable cooldowns in mock mode
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Achievements achievements={userData.achievements} />
          </div>
        </div>
      </div>

      <Assistant user={userData} />
    </main>
  );
} 