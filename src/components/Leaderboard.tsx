import { motion } from 'framer-motion';
import { User } from '@/types/game';
import { calculateLevel, getLevelTitle } from '@/utils/game';

interface LeaderboardProps {
  currentUser: User;
}

export default function Leaderboard({ currentUser }: LeaderboardProps) {
  // For now, we'll just show the current user's stats
  // In a real app, this would fetch data from a backend
  const leaderboardData = [
    {
      name: 'You',
      xp: currentUser.xp,
      level: calculateLevel(currentUser.xp),
      streak: currentUser.streak,
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
      <div className="space-y-4">
        {leaderboardData.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600 mr-4">#{index + 1}</span>
              <div>
                <h3 className="font-semibold">{entry.name}</h3>
                <p className="text-sm text-gray-600">{getLevelTitle(entry.level)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-purple-600">{entry.xp} XP</p>
              <p className="text-sm text-gray-600">Level {entry.level}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 