import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertModal = ({ alert, onClose }) => {
  // Get the backend URL to construct the full image path
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // --- THEME LOGIC ---
  // Define themes for different alert levels
  const themes = {
    critical: {
      borderColor: 'border-red-500',
      shadowColor: 'shadow-red-500/30',
      titleColor: 'text-red-400',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      icon: '🚨',
      title: 'CRITICAL ALERT'
    },
    info: {
      borderColor: 'border-green-500',
      shadowColor: 'shadow-green-500/30',
      titleColor: 'text-green-400',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      icon: 'ℹ️',
      title: 'INFORMATIONAL ALERT'
    }
  };

  // Determine the current theme based on the alert's threat_level
  const theme = themes[alert?.threat_level] || themes.info;
  // --- END THEME LOGIC ---

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MODIFIED: Using theme variables for dynamic styling */}
          <motion.div
            className={`bg-gray-900 border-4 rounded-xl p-6 w-full max-w-md text-white shadow-2xl ${theme.borderColor} ${theme.shadowColor}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className={`text-3xl font-bold mb-4 text-center ${theme.titleColor}`}>
              {theme.icon} {theme.title} {theme.icon}
            </h2>
            
            <div className="flex flex-col items-center gap-4">
              {/* MODIFIED: Construct the full image URL and display the image */}
              {alert.image_path ? (
                <img 
                  // The backend now serves the image from this URL
                  src={`${apiBaseUrl}/${alert.image_path.replace(/\\/g, '/')}`} 
                  alt={alert.name} 
                  className={`w-40 h-40 object-cover rounded-full border-4 ${theme.borderColor}`}
                />
              ) : (
                <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-gray-800 border-4 ${theme.borderColor}`}>
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-2xl font-bold">{alert.name}</p>
                <p className="text-gray-400">{alert.role}</p>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg w-full text-center">
                <p className="text-sm text-gray-400">Reason for Watchlist</p>
                <p className="font-semibold">{alert.reason}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-semibold">{alert.camera_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Confidence</p>
                  <p className="font-semibold">{(alert.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className={`px-8 py-2 text-white font-bold rounded-lg ${theme.buttonColor}`}
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;