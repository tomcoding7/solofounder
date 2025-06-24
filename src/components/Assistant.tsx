import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/game';
import { calculateLevel } from '@/utils/game';

interface AssistantProps {
  user: User;
}

export default function Assistant({ user }: AssistantProps) {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<'neutral' | 'happy' | 'excited'>('neutral');

  useEffect(() => {
    // Check if this is the first login
    if (user.actions.length === 0) {
      setMessage(`Welcome to Solo Founder System! I'm your AI assistant. Let's start your founder journey by completing some actions. Each action will earn you XP and help you level up!`);
      setMood('excited');
      return;
    }

    // Get the last action
    const lastAction = user.actions[user.actions.length - 1];
    const timeSinceLastAction = Date.now() - new Date(lastAction.timestamp).getTime();
    const hoursSinceLastAction = timeSinceLastAction / (1000 * 60 * 60);

    // Generate contextual messages
    if (hoursSinceLastAction > 24) {
      setMessage("Welcome back! Ready to continue your founder journey?");
      setMood('happy');
    } else if (user.momentum.isActive) {
      setMessage(`You're on fire! Keep the momentum going with your ${Math.round(user.momentum.multiplier * 100)}% XP boost!`);
      setMood('excited');
    } else {
      const level = calculateLevel(user.xp);
      const messages = [
        `Level ${level} ${user.class}! Keep pushing forward!`,
        `You're making great progress. What's next on your agenda?`,
        `Remember: consistency beats intensity. Keep showing up!`,
      ];
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMood('neutral');
    }
  }, [user]);

  const moodEmoji = {
    neutral: '🤖',
    happy: '😊',
    excited: '🚀',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 max-w-sm bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30"
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{moodEmoji[mood]}</div>
        <div>
          <p className="text-white">{message}</p>
        </div>
      </div>
    </motion.div>
  );
} 