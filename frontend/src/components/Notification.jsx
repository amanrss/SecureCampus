import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notification({ open, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-6 right-6 bg-gradient-to-r from-cyan-400 to-pink-400 text-black px-4 py-3 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
