import React, { useState } from "react";
import FaceRecognitionModal from "../components/FaceRecognitionModal";
import RegisterFaceModal from "../components/RegisterFaceModal"; // 1. Import the new modal

const Dashboard = () => {
  const [isRecognitionModalOpen, setRecognitionModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false); // 2. Add state for the new modal

  return (
    <div className="p-6 text-cyan-300 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">🚀 SecureCampus Dashboard</h1>
      <p className="mb-6">Monitor and manage campus security in real-time.</p>

      {/* 3. Change grid to 3 columns to fit the new card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-black border border-cyan-600 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-cyan-400 mb-3">Face Recognition</h2>
          <p className="mb-4">Recognize faces using an image or webcam snapshot.</p>
          <button
            onClick={() => setRecognitionModalOpen(true)}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
          >
            Open Recognition
          </button>
        </div>

        {/* 4. ADD THE NEW CARD FOR REGISTRATION */}
        <div className="bg-gradient-to-br from-gray-800 to-black border border-green-600 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-green-400 mb-3">Register New Face</h2>
          <p className="mb-4">Add a new person to the recognition database.</p>
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Open Registration
          </button>
        </div>

        {/* CCTV Placeholder */}
        <div className="bg-gradient-to-br from-gray-800 to-black border border-purple-600 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-purple-400 mb-3">📹 CCTV Live Feed</h2>
          <p className="mb-4">Coming soon: real-time CCTV monitoring.</p>
          <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            View CCTV
          </button>
        </div>
      </div>

      {/* 5. RENDER BOTH MODALS */}
      <FaceRecognitionModal isOpen={isRecognitionModalOpen} onClose={() => setRecognitionModalOpen(false)} />
      <RegisterFaceModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </div>
  );
};

export default Dashboard;