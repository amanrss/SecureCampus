import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { socket } from '../services/socket';

const CameraFeed = ({ camera_id, name }) => {
  const webcamRef = useRef(null);
  const [lastResult, setLastResult] = useState(null);
  const [isAlert, setIsAlert] = useState(false);
  const intervalRef = useRef(null);

  const captureAndRecognize = () => {
    // --- DEBUG LOG 1 ---
    console.log(`[${camera_id}] Attempting to capture frame...`);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      console.error(`[${camera_id}] Failed to get screenshot.`);
      return;
    }

    // --- DEBUG LOG 2 ---
    console.log(`[${camera_id}] Frame captured. Emitting 'process_frame' event.`);
    socket.emit('process_frame', { frame: imageSrc, camera_id: camera_id });
  };

  useEffect(() => {
    intervalRef.current = setInterval(captureAndRecognize, 2000);
    return () => clearInterval(intervalRef.current);
  }, [camera_id]);
  
  useEffect(() => {
    const handleAlert = (alertData) => {
      if (alertData.camera_id === camera_id) {
        setIsAlert(true);
        setTimeout(() => setIsAlert(false), 10000);
      }
    };

    const handleRecognitionResult = (resultData) => {
      // --- DEBUG LOG 3 ---
      console.log(`[${camera_id}] Received 'recognition_result':`, resultData);
      if (resultData.camera_id === camera_id) {
        setLastResult(resultData);
      }
    };

    socket.on('watchlist_alert', handleAlert);
    socket.on('critical_alert', handleAlert);
    socket.on('recognition_result', handleRecognitionResult);
    
    // --- DEBUG LOG 4 ---
    console.log(`[${camera_id}] Event listeners are set up.`);

    return () => {
      socket.off('watchlist_alert', handleAlert);
      socket.off('critical_alert', handleAlert);
      socket.off('recognition_result', handleRecognitionResult);
    };
  }, [camera_id]);

  const getBorderColor = () => {
    if (isAlert) return 'border-red-500 shadow-red-500/50';
    if (lastResult?.status === 'success') return 'border-green-500';
    if (lastResult?.status === 'unknown') return 'border-yellow-500';
    return 'border-cyan-700';
  };

  return (
    <motion.div 
      className={`relative rounded-lg overflow-hidden border-4 transition-all duration-500 ${getBorderColor()} shadow-lg`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-white">
        <p className="font-bold">{name}</p>
        <p className="text-xs">
          Status: {isAlert ? <span className="text-red-400 font-bold">WATCHLIST ALERT!</span> : (lastResult?.status || 'Streaming...')}
        </p>
        {lastResult?.status === 'success' && <p className="text-xs">Last Seen: {lastResult.name}</p>}
      </div>
    </motion.div>
  );
};


// Main page component (unchanged)
export default function LiveFeed() {
  const cameras = [
    { id: 'cam-01', name: 'Main Entrance' },
    { id: 'cam-02', name: 'Library Hall' },
    { id: 'cam-03', name: 'Cafeteria' },
    { id: 'cam-04', name: 'Parking Lot A' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Live Security Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cameras.map(cam => (
          <CameraFeed key={cam.id} camera_id={cam.id} name={cam.name} />
        ))}
      </div>
    </div>
  );
}