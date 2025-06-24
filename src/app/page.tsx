'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ACTIONS } from '@/types/game';
import { getDefaultUser, updateStreak, calculateLevel } from '@/utils/game';
import XPBar from '@/components/XPBar';
import ActionButton from '@/components/ActionButton';
import Streak from '@/components/Streak';
import FounderStats from '@/components/FounderStats';
import QuestLog from '@/components/QuestLog';
import StartupScreen from '@/components/StartupScreen';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function Home() {
  const [user, setUser] = useState<User>(getDefaultUser());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const { playXP, playLevelUp, playClick, playQuest } = useSoundEffects();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAction = (actionId: string) => {
    playClick();
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
      playLevelUp();
      setTimeout(() => setShowLevelUp(false), 3000);
    } else {
      playXP();
    }

    const updatedUser = updateStreak(newUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (isStarting) {
    return <StartupScreen onComplete={() => setIsStarting(false)} />;
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--deep-space))] flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] mx-auto">
        {/* Main Console Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="console-panel p-8 relative overflow-hidden"
        >
          {/* Level and XP Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="console-text text-2xl font-orbitron">
              Lv. {calculateLevel(user.xp)}
            </div>
            <div className="flex-1">
              <XPBar xp={user.xp} level={calculateLevel(user.xp)} />
            </div>
          </div>

          {/* Class Title */}
          <div className="text-center mb-8">
            <div className="console-text text-lg font-orbitron tracking-wider">
              FOUNDER / {user?.class?.toUpperCase() || 'INDIE HACKER'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ActionButton
              action={ACTIONS.find(a => a.id === 'post') || ACTIONS[0]}
              onClick={() => handleAction('post')}
            />
            <ActionButton
              action={ACTIONS.find(a => a.id === 'ship') || ACTIONS[0]}
              onClick={() => handleAction('ship')}
            />
            <ActionButton
              action={ACTIONS.find(a => a.id === 'dm') || ACTIONS[0]}
              onClick={() => handleAction('dm')}
            />
          </div>

          {/* Stats and Logs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Panel */}
            <div className="console-panel p-4">
              <FounderStats user={user} />
            </div>

            {/* XP Stats */}
            <div className="console-panel p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="console-text opacity-80">XP</span>
                  <span className="console-text text-xl">↑ {user.xp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="console-text opacity-80">STREAK</span>
                  <span className="console-text text-xl">🔥 {user.streak}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="console-text opacity-80">CASH EARNED</span>
                  <span className="console-text text-xl">£{user.xp * 2}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="console-text opacity-80">REJECTIONS</span>
                  <span className="console-text text-xl">{user.actions.filter(a => a.actionId === 'reject').length}</span>
                </div>
              </div>
            </div>

            {/* Quest Log */}
            <div className="console-panel p-4">
              <QuestLog user={user} />
            </div>
          </div>
        </motion.div>

        {/* System Messages */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 console-panel p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <div>
                  <div className="console-text font-bold">LEVEL UP!</div>
                  <div className="console-text text-sm opacity-80">
                    +20 XP - Completed
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
} 