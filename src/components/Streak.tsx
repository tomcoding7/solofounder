import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

interface StreakProps {
  streak: number;
}

export default function Streak({ streak }: StreakProps) {
  return (
    <motion.div
      className="relative flex items-center bg-gradient-to-r from-orange-900/50 to-red-900/50 text-orange-300 px-6 py-3 rounded-lg border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.2)]"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        className="absolute -inset-[1px] bg-gradient-to-r from-orange-400 to-red-400 opacity-20 rounded-lg"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <div className="relative flex items-center space-x-3">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <FaFire className="text-2xl text-orange-400" />
        </motion.div>
        <div>
          <span className="font-bold text-lg">{streak} Day Streak!</span>
          <p className="text-sm text-orange-300/70">Keep the momentum</p>
        </div>
      </div>
    </motion.div>
  );
} 