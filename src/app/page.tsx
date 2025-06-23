'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ACTIONS } from '@/types/game';
import { getDefaultUser, updateStreak, calculateLevel } from '@/utils/game';
import XPBar from '@/components/XPBar';
import ActionButton from '@/components/ActionButton';
import Streak from '@/components/Streak';
import ProgressChart from '@/components/ProgressChart';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const [user, setUser] = useState<User>(getDefaultUser());
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAction = (actionId: string) => {
    const action = ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    const newUser = {
      ...user,
      xp: user.xp + action.xp,
      actions: [
        ...user.actions,
        {
          id: Math.random().toString(36).substr(2, 9),
          actionId: action.id,
          timestamp: new Date().toISOString(),
          xp: action.xp,
        },
      ],
    };

    const oldLevel = calculateLevel(user.xp);
    const newLevel = calculateLevel(newUser.xp);

    if (newLevel > oldLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    const updatedUser = updateStreak(newUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Founder Quest</h1>
          <p className="text-gray-600">Level up your entrepreneurship journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <XPBar xp={user.xp} level={calculateLevel(user.xp)} />
              {user.streak > 0 && (
                <div className="mt-4 flex justify-center">
                  <Streak streak={user.streak} />
                </div>
              )}
            </div>

            <ProgressChart actions={user.actions} />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Actions</h2>
              <div className="grid gap-3">
                {ACTIONS.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onClick={() => handleAction(action.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Leaderboard currentUser={user} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-bold">Level Up! 🎉</h3>
            <p>You reached Level {calculateLevel(user.xp)}!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 