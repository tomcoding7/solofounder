import { motion } from 'framer-motion';
import { User } from '@/types/game';

interface FounderStatsProps {
  user: User;
}

export default function FounderStats({ user }: FounderStatsProps) {
  // Default stats if user.stats is undefined
  const defaultStats = {
    execution: 1,
    resilience: 1,
    conviction: 1,
    influence: 1,
  };

  const stats = [
    { name: 'EXECUTION', value: user?.stats?.execution ?? defaultStats.execution, icon: '⚔️' },
    { name: 'RESILIENCE', value: user?.stats?.resilience ?? defaultStats.resilience, icon: '🛡️' },
    { name: 'CONVICTION', value: user?.stats?.conviction ?? defaultStats.conviction, icon: '✨' },
    { name: 'INFLUENCE', value: user?.stats?.influence ?? defaultStats.influence, icon: '👑' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="console-text text-xl mb-6">FOUNDER STATS</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="console-panel p-3 relative group">
              {/* Glowing border on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--neon-blue),0.1)] to-[rgba(var(--neon-purple),0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              
              {/* Stat content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="console-text text-sm font-semibold tracking-wider opacity-80">
                    {stat.name}
                  </span>
                </div>
                <div className="console-text text-2xl font-bold">
                  {stat.value}
                </div>
              </div>

              {/* Bottom border glow */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[rgba(var(--neon-blue),0.3)] to-[rgba(var(--neon-purple),0.3)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="console-panel p-3">
          <div className="console-text text-sm opacity-80">XP GAINED</div>
          <div className="console-text text-xl">{user?.xp ?? 0}</div>
        </div>
        <div className="console-panel p-3">
          <div className="console-text text-sm opacity-80">STREAK</div>
          <div className="console-text text-xl">{user?.streak ?? 0} days</div>
        </div>
      </div>
    </div>
  );
} 