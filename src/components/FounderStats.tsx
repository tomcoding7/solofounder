import { User } from '@/types/game';
import { calculateLevel } from '@/utils/game';

interface FounderStatsProps {
  user: User;
}

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
}

const StatBar = ({ label, value, maxValue }: StatBarProps) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-purple-300">{label}</span>
        <span className="text-purple-400">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function FounderStats({ user }: FounderStatsProps) {
  const level = calculateLevel(user.xp);
  
  // Calculate RPG-style stats based on level and achievements
  const completedAchievements = user.achievements.filter(a => a.completed).length;
  const baseStats = {
    strength: Math.floor(level * 5 + completedAchievements * 2),
    intelligence: Math.floor(level * 7 + completedAchievements * 3),
    dexterity: Math.floor(level * 4 + completedAchievements * 2),
    charisma: Math.floor(level * 6 + completedAchievements * 2),
  };

  // Calculate max values for stats
  const maxStats = {
    strength: baseStats.strength + 20,
    intelligence: baseStats.intelligence + 20,
    dexterity: baseStats.dexterity + 20,
    charisma: baseStats.charisma + 20,
  };

  return (
    <div className="stat-panel space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-300 solo-text-shadow">
          Founder Stats
        </h2>
        <span className="level-badge">
          Level {level}
        </span>
      </div>

      <StatBar
        label="Strength"
        value={baseStats.strength}
        maxValue={maxStats.strength}
      />
      <StatBar
        label="Intelligence"
        value={baseStats.intelligence}
        maxValue={maxStats.intelligence}
      />
      <StatBar
        label="Dexterity"
        value={baseStats.dexterity}
        maxValue={maxStats.dexterity}
      />
      <StatBar
        label="Charisma"
        value={baseStats.charisma}
        maxValue={maxStats.charisma}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-2 bg-black/30 rounded-lg solo-border">
          <div className="text-sm text-purple-400">Achievements</div>
          <div className="text-lg font-bold text-purple-300">
            {completedAchievements}
          </div>
        </div>
        <div className="text-center p-2 bg-black/30 rounded-lg solo-border">
          <div className="text-sm text-purple-400">Actions</div>
          <div className="text-lg font-bold text-purple-300">
            {user.actions.length}
          </div>
        </div>
      </div>
    </div>
  );
} 