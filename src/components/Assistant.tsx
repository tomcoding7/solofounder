import React from 'react';
import { User } from '@/types/game';

interface AssistantProps {
  user: User;
}

const Assistant: React.FC<AssistantProps> = ({ user }) => {
  const getAssistantMood = () => {
    // Check momentum status
    const lastAction = user.momentum.lastActionTimestamp 
      ? new Date(user.momentum.lastActionTimestamp)
      : null;
    
    if (!lastAction) {
      return {
        emoji: '🤔',
        message: "Ready to start your founder journey?",
        color: 'text-blue-400'
      };
    }

    const hoursSinceAction = (new Date().getTime() - lastAction.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceAction > 48) {
      return {
        emoji: '😟',
        message: "I haven't seen you in a while! Let's get back on track.",
        color: 'text-red-400'
      };
    }
    
    if (hoursSinceAction > 24) {
      return {
        emoji: '😐',
        message: "Don't lose your momentum! Take action soon.",
        color: 'text-yellow-400'
      };
    }

    // Check achievements
    const completedAchievements = user.achievements.filter(a => a.completed).length;
    if (completedAchievements > 0) {
      return {
        emoji: '🌟',
        message: `Amazing progress! You've unlocked ${completedAchievements} achievements!`,
        color: 'text-purple-400'
      };
    }

    // Check streak
    if (user.streak > 7) {
      return {
        emoji: '🔥',
        message: `${user.streak} day streak! You're unstoppable!`,
        color: 'text-green-400'
      };
    }

    // Default positive state
    return {
      emoji: '😊',
      message: "Keep pushing forward! You're doing great!",
      color: 'text-blue-400'
    };
  };

  const mood = getAssistantMood();

  return (
    <div className="fixed bottom-4 right-4 max-w-sm">
      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
            {mood.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-orbitron text-purple-300 mb-1">AI Assistant</h3>
            <p className={`${mood.color} text-sm`}>
              {mood.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant; 