import { motion } from 'framer-motion';
import { calculateProgress, getLevelTitle } from '@/utils/game';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const progress = calculateProgress(xp);
  const title = getLevelTitle(level);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-2xl font-bold text-purple-600">Level {level}</span>
          <span className="ml-2 text-gray-600">{title}</span>
        </div>
        <span className="text-gray-600">{xp} XP</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
} 