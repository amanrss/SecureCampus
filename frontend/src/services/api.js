import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 20000,
});

// Faces
export const registerFace = (formData) =>
  API.post('/faces/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const listFaces = () => API.get('/faces/list');

export const deleteFace = (faceId) => API.delete(`/faces/${faceId}`);

export const updateFace = (faceId, name, role) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('role', role);
  // Note: For photo updates, a more complex endpoint would be needed.
  // This version handles name and role updates.
  return API.put(`/faces/${faceId}`, formData);
};

export const recognizeFace = (formData) =>
  API.post('/face/recognize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Logs & CCTV
export const getLogs = () => API.get('/logs');
export const exportLogsCsv = () => API.get('/logs/export');
export const getCCTVFeeds = () => API.get('/cctv/feeds');


// --- ADDED WATCHLIST FUNCTIONS ---
export const getWatchlist = () => API.get('/watchlist/');

export const addToWatchlist = (faceId, name, reason, threatLevel) => 
  API.post('/watchlist/', { face_id: faceId, name, reason, threat_level: threatLevel });

export const removeFromWatchlist = (faceId) => 
  API.delete(`/watchlist/${faceId}`);
// --- END OF NEW FUNCTIONS ---


export default API;