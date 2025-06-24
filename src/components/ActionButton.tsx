import React from 'react';
import { Action } from '@/types/game';

interface ActionButtonProps {
  action: Action;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full p-4 rounded-lg border transform
        ${disabled 
          ? 'bg-black/20 border-gray-700/30 cursor-not-allowed' 
          : 'bg-black/30 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-900/20 hover:scale-[1.02] active:scale-[0.98]'
        }
        backdrop-blur-md transition-all duration-300
      `}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500/30" />

      {/* Content */}
      <div className="flex flex-col items-center space-y-2">
        <span className="text-2xl">{action.icon}</span>
        <div className="text-center">
          <div className={`font-medium ${disabled ? 'text-gray-400' : 'text-purple-300'}`}>
            {action.name}
          </div>
          <div className="text-sm text-gray-400">+{action.xp} XP</div>
        </div>
      </div>

      {/* Cooldown Indicator */}
      {action.cooldown && (
        <div className="absolute bottom-1 right-1 text-xs text-gray-400">
          ⏱️ {action.cooldown}m
        </div>
      )}
    </button>
  );
};

export default ActionButton; 