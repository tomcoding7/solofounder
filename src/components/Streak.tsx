import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

interface StreakProps {
  streak: number;
}

export default function Streak({ streak }: StreakProps) {
  return (
    <motion.div
      className="flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <FaFire className="text-xl mr-2" />
      <span className="font-bold">{streak} Day Streak!</span>
    </motion.div>
  );
} 