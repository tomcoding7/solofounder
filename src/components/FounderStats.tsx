import React from 'react';
import { User } from '@/types/game';

interface FounderStatsProps {
  user: User;
}

const FounderStats: React.FC<FounderStatsProps> = ({ user }) => {
  const maxStat = 100;

  const stats = [
    { name: 'Execution', value: user.stats.execution, icon: '⚡' },
    { name: 'Resilience', value: user.stats.resilience, icon: '🛡️' },
    { name: 'Conviction', value: user.stats.conviction, icon: '🎯' },
    { name: 'Influence', value: user.stats.influence, icon: '✨' },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
      <h2 className="text-xl font-orbitron text-purple-300 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Founder Stats
      </h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="relative">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-lg mr-2">{stat.icon}</span>
                <span className="text-gray-300">{stat.name}</span>
              </div>
              <span className="text-purple-300">{stat.value}</span>
            </div>
            <div className="h-2 bg-black/50 rounded overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${(stat.value / maxStat) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FounderStats; 