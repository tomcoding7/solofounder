import React from 'react';
import { calculateProgress } from '@/utils/game';
import { LEVEL_THRESHOLDS } from '@/types/game';

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
}

const XPBar: React.FC<XPBarProps> = ({ xp, level = 1, className = '' }) => {
  const progress = calculateProgress(xp);
  const safeLevel = Math.max(1, Math.min(level, LEVEL_THRESHOLDS.length));
  const currentThreshold = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
  const nextThreshold = safeLevel < LEVEL_THRESHOLDS.length 
    ? LEVEL_THRESHOLDS[safeLevel]
    : currentThreshold + 1000;

  return (
    <div className={`bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-orbitron text-xl text-purple-300">Level {safeLevel}</div>
        <div className="text-gray-300">
          {xp - currentThreshold} / {nextThreshold - currentThreshold} XP
        </div>
      </div>
      <div className="h-4 bg-black/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar; 