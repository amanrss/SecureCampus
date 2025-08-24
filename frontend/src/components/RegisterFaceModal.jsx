import React, { useState, useRef } from 'react';
import { registerFace } from '../services/api';
import Webcam from 'react-webcam'; // 1. ADD Webcam import

const RegisterFaceModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // --- ADDED: State and refs for webcam ---
  const [mode, setMode] = useState('upload');
  const [showWebcam, setShowWebcam] = useState(true);
  const webcamRef = useRef(null);
  // -----------------------------------------

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  // ADDED: Function to capture from webcam
  const captureFromWebcam = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setShowWebcam(false); // Hide webcam after capture
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
    
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setSelectedFile(null);
    setPreview(null);
    setLoading(false);
    setMessage(null);
    setShowWebcam(true); // Also reset webcam visibility
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !selectedFile) {
      setMessage({ type: 'error', text: 'Name and image file are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('file', selectedFile);

    try {
      const res = await registerFace(formData);
      setMessage({ type: 'success', text: `Successfully registered ${res.data.name}!` });
      resetForm(); // Reset everything on success
    } catch (err) {
      const errorText = err.response?.data?.detail || 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500 shadow-2xl rounded-xl p-6 w-[600px] relative text-cyan-300 font-mono">
        <button
          className="absolute top-2 right-2 text-cyan-400 hover:text-red-400"
          onClick={handleClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          ➕ Register New Face
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-cyan-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Role / Description (e.g., Student, Staff)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-cyan-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          
          {/* MODIFIED: Added mode toggle and conditional UI */}
          <div className="flex gap-2 mb-2">
            <button type="button" className={`px-4 py-1 rounded-md text-sm ${mode === 'upload' ? 'bg-cyan-600' : 'bg-gray-700'}`} onClick={() => { setMode('upload'); setShowWebcam(true); }}>Upload</button>
            <button type="button" className={`px-4 py-1 rounded-md text-sm ${mode === 'webcam' ? 'bg-cyan-600' : 'bg-gray-700'}`} onClick={() => { setMode('webcam'); setShowWebcam(true); }}>Webcam</button>
          </div>
          
          {mode === 'upload' ? (
            <div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="registerFileUpload"/>
              <label htmlFor="registerFileUpload" className="cursor-pointer w-full text-center block px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Select Image File'}
              </label>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-3'>
              {showWebcam && <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className='rounded-lg border border-cyan-500' />}
              <button type="button" onClick={captureFromWebcam} className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg'>
                Capture Photo
              </button>
            </div>
          )}

          {preview && (
            <div className="text-center">
              <p className='text-sm text-gray-400 mb-2'>Image Preview:</p>
              <img src={preview} alt="preview" className="w-40 h-40 object-cover border-2 border-cyan-500 mx-auto rounded-lg" />
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register Face'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 text-center p-2 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterFaceModal;