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
    <div className="w-full max-w-2xl relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <span className="text-2xl font-bold text-white">{level}</span>
            </div>
            <motion.div
              className="absolute -inset-1 bg-purple-500 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-sm text-gray-500">System Rank</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-600">{xp} XP</span>
          <p className="text-sm text-gray-500">Total Experience</p>
        </div>
      </div>
      
      <div className="h-6 bg-gray-800 rounded-lg overflow-hidden border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] relative">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGwyMCAyME0yMCAwTDAgMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-20"/>
        </motion.div>
        <motion.div
          className="absolute top-0 left-0 h-full w-2 bg-white opacity-20"
          animate={{ 
            x: ["0%", "100%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Progress to Next Level</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
} 