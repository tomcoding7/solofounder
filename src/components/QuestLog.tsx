import { motion } from 'framer-motion';
import { User } from '@/types/game';

interface QuestLogProps {
  user: User;
}

export default function QuestLog({ user }: QuestLogProps) {
  // Example quests - in a real app these would come from a backend
  const quests = [
    {
      id: 'daily_post',
      title: 'Daily Content',
      description: 'Post valuable content',
      target: 1,
      progress: user.actions.filter(a => a.actionId === 'post' && 
        new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
      icon: '📝',
    },
    {
      id: 'weekly_ship',
      title: 'Ship It!',
      description: 'Ship a new feature/product',
      target: 1,
      progress: user.actions.filter(a => a.actionId === 'ship').length % 1,
      icon: '🚀',
    },
    {
      id: 'streak',
      title: 'Keep The Streak',
      description: 'Maintain daily activity',
      target: 7,
      progress: user.streak,
      icon: '🔥',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="console-text text-xl mb-6">QUEST LOG</h2>
      <div className="space-y-4">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="quest-item"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{quest.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="console-text font-semibold">
                    {quest.title}
                  </h3>
                  <span className="console-text text-sm opacity-80">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
                
                <p className="console-text text-sm opacity-70 mb-2">
                  {quest.description}
                </p>

                {/* Progress bar */}
                <div className="xp-bar h-1.5">
                  <motion.div
                    className="xp-progress h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Bonus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="console-panel p-4 mt-6"
      >
        <div className="flex items-center justify-between">
          <div className="console-text text-sm opacity-80">
            DAILY STREAK BONUS
          </div>
          <div className="console-text font-bold">
            {user.streak}x
          </div>
        </div>
      </motion.div>
    </div>
  );
} 