import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ title, children, variant }) {
  return (
    <motion.div
      className="glass p-5 rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {title && <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <div className="text-xs text-slate-400">{variant}</div>
      </div>}
      <div>{children}</div>
    </motion.div>
  );
}
