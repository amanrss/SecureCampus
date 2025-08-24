import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import LiveFeed from './pages/LiveFeed';
import { socket } from './services/socket';
import Admin from './pages/Admin';
// REMOVED: import AlertModal from './components/AlertModal';
import { AlertProvider, useAlerts } from './context/AlertContext'; // ADDED

// A new component to handle listening to socket events
const SocketAlertListener = () => {
  const { showAlert } = useAlerts();

  useEffect(() => {
    const onAlert = (data) => {
      showAlert(data);
    };

    socket.on('watchlist_alert', onAlert);
    socket.on('critical_alert', onAlert);

    return () => {
      socket.off('watchlist_alert', onAlert);
      socket.off('critical_alert', onAlert);
    };
  }, [showAlert]);

  return null; // This component does not render anything
};


export default function App(){
  // MODIFIED: All alert state is now in AlertContext
  const [campusStatus, setCampusStatus] = useState('normal');

  // We still need to handle the campus-wide banner state here
  useEffect(() => {
    const onCriticalAlert = (data) => {
      setCampusStatus('critical');
    };
    socket.on('critical_alert', onCriticalAlert);
    return () => {
      socket.off('critical_alert', onCriticalAlert);
    };
  }, []);

  return (
    // WRAPPED the entire app in AlertProvider
    <AlertProvider>
      {/* This component now handles setting alerts */}
      <SocketAlertListener />

      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            campusStatus={campusStatus} 
            resetCampusStatus={() => setCampusStatus('normal')} 
          />
          <main className="flex-1 overflow-auto p-6 scanlines">
            <Routes>
              <Route path="/" element={<Navigate to='/home' replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/live-feed" element={<LiveFeed />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </AlertProvider>
  );
}