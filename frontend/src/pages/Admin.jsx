import React, { useState, useEffect, useCallback } from 'react';
import { listFaces, getWatchlist, addToWatchlist, removeFromWatchlist, deleteFace, updateFace } from '../services/api';
import GlassCard from '../components/GlassCard';

// --- EditFaceModal Component (unchanged) ---
const EditFaceModal = ({ person, onClose, onSave }) => {
  const [name, setName] = useState(person.name);
  const [role, setRole] = useState(person.role || '');

  const handleSave = () => {
    onSave(person.id, name, role);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-cyan-400">Edit Details for {person.name}</h3>
        <div className="my-4 space-y-4">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
};


// --- AddToWatchlistModal Component (unchanged) ---
const AddToWatchlistModal = ({ person, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [threatLevel, setThreatLevel] = useState('info');

  const handleSubmit = () => {
    if (!reason) {
      alert('Please provide a reason.');
      return;
    }
    onConfirm(reason, threatLevel);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-500 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-yellow-400">Add {person.name} to Watchlist</h3>
        <p className="text-gray-400 mt-2 mb-4">Provide a reason and set a threat level.</p>
        
        <label className="text-sm text-gray-400">Threat Level</label>
        <select
          value={threatLevel}
          onChange={(e) => setThreatLevel(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value="info">Informational</option>
          <option value="critical">Critical (e.g., Banned)</option>
        </select>
        
        <label className="text-sm text-gray-400">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Previously involved in an incident"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          rows="3"
        ></textarea>
        
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
};


export default function Admin() {
  const [faces, setFaces] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPerson, setModalPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [facesRes, watchlistRes] = await Promise.all([
        listFaces(),
        getWatchlist()
      ]);
      setFaces(facesRes.data.faces || []);
      setWatchlist(watchlistRes.data.watchlist || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- THESE FUNCTIONS WERE MISSING - ADDING THEM BACK ---
  const refreshWatchlist = async () => {
    try {
      const watchlistRes = await getWatchlist();
      setWatchlist(watchlistRes.data.watchlist || []);
    } catch (error) {
      console.error("Failed to refresh watchlist:", error);
    }
  };

  const handleAddToWatchlist = async (reason, threatLevel) => {
    if (!modalPerson) return;
    try {
      await addToWatchlist(modalPerson.id, modalPerson.name, reason, threatLevel);
      setModalPerson(null);
      await refreshWatchlist();
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      alert(error.response?.data?.detail || 'Failed to add to watchlist.');
    }
  };
  
  const handleRemoveFromWatchlist = async (faceId) => {
    if (!window.confirm("Are you sure you want to remove this person from the watchlist?")) return;
    try {
      await removeFromWatchlist(faceId);
      await refreshWatchlist();
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      alert('Failed to remove from watchlist.');
    }
  };
  // --- END OF MISSING FUNCTIONS ---

  const handleEditFace = async (faceId, name, role) => {
    try {
      await updateFace(faceId, name, role);
      setEditingPerson(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update face:", error);
      alert('Failed to update face.');
    }
  };

  const handleDeleteFace = async (faceId) => {
    if (!window.confirm("Are you sure you want to permanently delete this person? This action cannot be undone.")) return;
    try {
      await deleteFace(faceId);
      fetchData();
    } catch (error) {
      console.error("Failed to delete face:", error);
      alert('Failed to delete face.');
    }
  };

  if (loading) return <div>Loading Admin Panel...</div>;

  const watchlistFaceIds = new Set(watchlist.map(p => p.face_id));

  return (
    <div className="space-y-6">
      {modalPerson && (
        <AddToWatchlistModal
          person={modalPerson}
          onClose={() => setModalPerson(null)}
          onConfirm={handleAddToWatchlist}
        />
      )}

      {editingPerson && (
        <EditFaceModal 
          person={editingPerson}
          onClose={() => setEditingPerson(null)}
          onSave={handleEditFace}
        />
      )}

      <h1 className="text-3xl font-bold text-cyan-400">Admin Panel</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="All Registered Faces">
          <div className="max-h-96 overflow-y-auto pr-2">
            <table className="w-full text-left">
              <thead>
                <tr><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {faces.map(face => (
                  <tr key={face.id} className="border-t border-slate-700">
                    <td className="py-2">{face.name}</td>
                    <td>{face.role || 'N/A'}</td>
                    <td>
                      {watchlistFaceIds.has(face.id) ? (
                        <span className="text-yellow-400 text-sm">On Watchlist</span>
                      ) : (
                        <button 
                          onClick={() => setModalPerson(face)}
                          className="px-2 py-1 text-xs bg-yellow-600 text-black rounded hover:bg-yellow-500"
                        >
                          Add to Watchlist
                        </button>
                      )}
                    </td>
                    <td className="space-x-2">
                       <button 
                         onClick={() => setEditingPerson(face)}
                         className="px-2 py-1 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-500"
                       >
                         Edit
                       </button>
                       <button 
                         onClick={() => handleDeleteFace(face.id)}
                         className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                       >
                         Delete
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard title="Watchlist Members">
          <div className="max-h-96 overflow-y-auto pr-2">
             <table className="w-full text-left">
              <thead>
                <tr><th>Name</th><th>Threat</th><th>Action</th></tr>
              </thead>
              <tbody>
                {watchlist.map(person => (
                  <tr key={person.face_id} className="border-t border-slate-700">
                    <td className="py-2">{person.name}</td>
                    <td className={person.threat_level === 'critical' ? 'text-red-400 font-bold' : ''}>
                      {person.threat_level || 'info'}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveFromWatchlist(person.face_id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                 {watchlist.length === 0 && (
                  <tr><td colSpan="3" className="py-4 text-center text-gray-400">Watchlist is empty.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}