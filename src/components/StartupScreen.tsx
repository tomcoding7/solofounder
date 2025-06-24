import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StartupScreenProps {
  onComplete: () => void;
}

export default function StartupScreen({ onComplete }: StartupScreenProps) {
  const [step, setStep] = useState(0);
  const messages = [
    "Initializing Solo Founder System...",
    "Loading Founder Stats...",
    "Calibrating System Interface...",
    "Establishing Neural Link...",
    "System Ready."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < messages.length - 1) {
        setStep(step + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-20 bg-purple-500/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600"
          >
            Solo Founder System
          </motion.h1>
          
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= step ? 1 : 0,
                  x: index <= step ? 0 : -20
                }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2">
                  {index <= step && (
                    <motion.div
                      className="w-2 h-2 bg-purple-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    />
                  )}
                </div>
                <span className="text-purple-300 font-mono">{message}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="h-1 bg-purple-900 rounded-full overflow-hidden mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step + 1) * (100 / messages.length)}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 