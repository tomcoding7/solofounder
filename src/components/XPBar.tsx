import { motion } from 'framer-motion';
import { calculateProgress } from '@/utils/game';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const progress = calculateProgress(xp);
  const nextLevelXP = 1000; // Fixed XP per level in the image

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="console-text text-sm opacity-80">
          {xp} / {nextLevelXP} XP
        </span>
      </div>
      <div className="xp-bar">
        <motion.div
          className="xp-progress h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
} 