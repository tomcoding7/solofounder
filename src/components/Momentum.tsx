import React from 'react';
import { Momentum as MomentumType } from '@/types/game';

interface MomentumProps {
  momentum: MomentumType;
}

const Momentum: React.FC<MomentumProps> = ({ momentum }) => {
  const formattedMultiplier = `${(momentum.multiplier * 100).toFixed(0)}%`;
  const lastAction = momentum.lastActionTimestamp 
    ? new Date(momentum.lastActionTimestamp)
    : null;
  
  const getTimeAgo = () => {
    if (!lastAction) return 'No actions yet';
    const now = new Date();
    const hours = Math.floor((now.getTime() - lastAction.getTime()) / (1000 * 60 * 60));
    
    if (hours < 1) return 'Less than an hour ago';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const getMomentumStatus = () => {
    if (!lastAction) return { icon: '⚡', text: 'Ready to start!', color: 'text-gray-400' };
    const hoursSinceAction = (new Date().getTime() - lastAction.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceAction <= 24) {
      return { icon: '🔥', text: 'Momentum active!', color: 'text-green-400' };
    } else if (hoursSinceAction <= 48) {
      return { icon: '⚠️', text: 'Momentum at risk!', color: 'text-yellow-400' };
    } else {
      return { icon: '💤', text: 'Momentum lost', color: 'text-red-400' };
    }
  };

  const status = getMomentumStatus();

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
      <h2 className="text-xl font-orbitron text-purple-300 mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Momentum
      </h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Multiplier</span>
            <span className={`text-lg font-medium ${momentum.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {formattedMultiplier}
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${((momentum.multiplier - 1) / 0.5) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Streak</span>
            <span className="text-lg font-medium text-purple-300">
              {momentum.streakDays} days
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{status.icon}</span>
            <div>
              <p className={`font-medium ${status.color}`}>{status.text}</p>
              <p className="text-sm text-gray-400">{getTimeAgo()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Momentum; 