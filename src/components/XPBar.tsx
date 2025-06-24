import { useEffect, useRef, useState } from 'react';
import { calculateLevel, calculateProgress, getXPForNextLevel } from '@/utils/game';

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
}

export default function XPBar({ xp, level, className = '' }: XPBarProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevXpRef = useRef(xp);
  const nextLevelXp = getXPForNextLevel(xp);
  const progress = calculateProgress(xp);

  // Trigger animation when XP changes
  useEffect(() => {
    if (xp !== prevXpRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      prevXpRef.current = xp;
      return () => clearTimeout(timer);
    }
  }, [xp]);

  // Debug logs
  useEffect(() => {
    console.log('XPBar Update:', {
      xp,
      level,
      nextLevelXp,
      progress
    });
  }, [xp, level, nextLevelXp, progress]);

  return (
    <div className={`stat-panel ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-purple-300">Level {level}</div>
        <div className="text-sm text-purple-400">
          {xp} / {nextLevelXp} XP
        </div>
      </div>
      <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden solo-border">
        <div
          className={`h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 ${
            isAnimating ? 'animate-pulse' : ''
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 