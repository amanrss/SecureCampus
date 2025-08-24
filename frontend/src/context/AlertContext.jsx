import React, { createContext, useState, useContext, useCallback } from 'react';
import AlertModal from '../components/AlertModal';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());

  const showAlert = useCallback((alertData) => {
    // To give each alert a unique ID, we can combine face_id and a timestamp
    const alertId = `${alertData.name}_${alertData.camera_id}_${Date.now()}`;
    const newAlert = { ...alertData, id: alertId };
    
    // Only show a new alert if it hasn't been recently acknowledged
    if (!acknowledgedAlerts.has(newAlert.name)) {
      setActiveAlert(newAlert);
    }
  }, [acknowledgedAlerts]);

  const acknowledgeAlert = () => {
    if (!activeAlert) return;

    // Add the person's name to a temporary acknowledged list
    setAcknowledgedAlerts(prev => new Set(prev).add(activeAlert.name));
    
    // Hide the current modal
    setActiveAlert(null);

    // After 5 seconds, remove the person from the acknowledged list,
    // allowing a new alert for them to be shown.
    setTimeout(() => {
      setAcknowledgedAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeAlert.name);
        return newSet;
      });
    }, 5000); // 5 seconds cooldown
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal alert={activeAlert} onClose={acknowledgeAlert} />
    </AlertContext.Provider>
  );
};