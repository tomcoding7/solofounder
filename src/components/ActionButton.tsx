import { motion } from 'framer-motion';
import { Action } from '@/types/game';

interface ActionButtonProps {
  action: Action;
  onClick: () => void;
}

export default function ActionButton({ action, onClick }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 mb-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{action.icon}</span>
        <span className="font-medium">{action.name}</span>
      </div>
      <div className="flex items-center">
        <span className="text-purple-600 font-bold">+{action.xp} XP</span>
      </div>
    </motion.button>
  );
} 