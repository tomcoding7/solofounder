import { motion } from 'framer-motion';
import { Action } from '@/types/game';

interface ActionButtonProps {
  action: Action;
  onClick: () => void;
}

export default function ActionButton({ action, onClick }: ActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="action-button w-full h-32 relative group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--neon-blue),0.1)] to-[rgba(var(--neon-purple),0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
          {action.icon}
        </div>
        <div className="console-text font-semibold tracking-wider text-lg mb-1">
          {action.name.toUpperCase()}
        </div>
        <div className="console-text text-sm opacity-70">
          +{action.xp} XP
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 border border-[rgba(var(--neon-blue),0.2)] rounded-lg" />
      
      {/* Hover border effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgba(var(--neon-blue),0.5)] to-[rgba(var(--neon-purple),0.5)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[rgba(var(--neon-blue),0.3)]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[rgba(var(--neon-blue),0.3)]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[rgba(var(--neon-blue),0.3)]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[rgba(var(--neon-blue),0.3)]" />
    </motion.button>
  );
} 