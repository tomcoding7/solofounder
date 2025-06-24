import React from 'react';
import { Achievement } from '@/types/game';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
      <h2 className="text-xl font-orbitron text-purple-300 mb-4 flex items-center">
        <span className="mr-2">🏆</span>
        Achievements
      </h2>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="relative">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className={`text-lg mr-2 ${achievement.completed ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {achievement.completed ? '✨' : '🔒'}
                </span>
                <h3 className={`font-medium ${achievement.completed ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {achievement.name}
                </h3>
              </div>
              <span className="text-sm text-gray-400">
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <div className="h-2 bg-black/50 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  achievement.completed ? 'bg-yellow-400' : 'bg-purple-500'
                }`}
                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 