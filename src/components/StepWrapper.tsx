import React from 'react';
import { motion } from 'motion/react';

interface StepWrapperProps {
  children: React.ReactNode;
  key?: React.Key;
}

export function StepWrapper({ children }: StepWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto px-6 py-8"
    >
      {children}
    </motion.div>
  );
}
