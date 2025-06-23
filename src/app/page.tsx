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
    <main className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.1),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTMwIDMwbDMwIDMwTTMwIDMwTDAgNjBNMzAgMzBMMzAgME0zMCAzMEwwIDAiIHN0cm9rZT0icmdiYSgxNjgsODUsMjQ3LDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-5" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3 text-shadow-glow">
            Founder Quest
          </h1>
          <p className="text-gray-400 text-lg">Level up your entrepreneurship journey</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/20 p-6"
            >
              <XPBar xp={user.xp} level={calculateLevel(user.xp)} />
              {user.streak > 0 && (
                <div className="mt-6">
                  <Streak streak={user.streak} />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                Available Actions
              </h2>
              <div className="grid gap-4">
                {ACTIONS.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ActionButton action={action} onClick={() => handleAction(action.id)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Leaderboard currentUser={user} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-purple-900/90 backdrop-blur-sm text-white px-8 py-4 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-400/50"
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">Level Up! 🎉</h3>
            <p className="text-purple-200">You reached Level {calculateLevel(user.xp)}!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 