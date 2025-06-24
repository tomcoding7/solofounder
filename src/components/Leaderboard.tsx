import { User } from '@/types/game';
import { calculateLevel } from '@/utils/game';

interface LeaderboardProps {
  currentUser: User;
}

export default function Leaderboard({ currentUser }: LeaderboardProps) {
  // Calculate current level based on XP
  const level = calculateLevel(currentUser.xp);

  return (
    <div className="stat-panel">
      <h2 className="text-xl font-bold text-purple-300 mb-4 solo-text-shadow">
        Leaderboard
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg solo-border">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🥇</div>
            <div>
              <div className="font-bold text-purple-300">You</div>
              <div className="text-sm text-purple-400">Operator</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-300">{currentUser.xp} XP</div>
            <div className="text-sm text-purple-400">Level {level}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 