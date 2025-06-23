import { motion } from 'framer-motion';
import { Action } from '@/types/game';

interface ActionButtonProps {
  action: Action;
  onClick: () => void;
}

export default function ActionButton({ action, onClick }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full px-6 py-4 bg-gray-900 rounded-lg border border-purple-400/30 hover:border-purple-400/60 shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      
      <div className="flex items-center justify-between relative">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center border border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <span className="text-2xl">{action.icon}</span>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
              {action.name}
            </h3>
            <p className="text-sm text-gray-400">Gain experience points</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <span className="text-purple-300 font-mono">+{action.xp} XP</span>
          </div>
          <motion.div
            className="w-6 h-6 flex items-center justify-center"
            initial={false}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
} 