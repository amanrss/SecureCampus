import React, { useState, useRef, useEffect } from "react";
import { recognizeFace } from "../services/api";

const FaceRecognitionModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ADDED: A function to reset the modal's state
  const resetState = () => {
    setSelectedFile(null);
    setPreview(null);
    setLoading(false);
    setResult(null);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const captureSnapshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setSelectedFile(blob);
      setPreview(URL.createObjectURL(blob));
    }, "image/jpeg");

    stopCamera();
  };

  const handleRecognition = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await recognizeFace(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Recognition failed" });
    } finally {
      setLoading(false);
    }
  };
  
  // MODIFIED: This function now also resets the state
  const handleClose = () => {
    stopCamera();
    resetState(); // Reset the state on close
    onClose();
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
          🔍 Face Recognition
        </h2>

        {/* Upload */}
        <div className="mb-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedFile(file);
              setPreview(URL.createObjectURL(file));
            }}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg mr-3"
          >
            Upload Image
          </label>

          <button
            onClick={startCamera}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Start Webcam
          </button>
        </div>

        {/* Webcam Preview */}
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 border border-cyan-500 rounded-md mb-3 bg-black"
          />
          <button
            onClick={captureSnapshot}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mb-4"
          >
            Capture Snapshot
          </button>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-4 text-center">
            <p className="mb-2">Preview:</p>
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-cover border-2 border-cyan-500 mx-auto rounded-lg"
            />
          </div>
        )}

        {/* Action */}
        <div className="text-center">
          <button
            onClick={handleRecognition}
            disabled={!selectedFile || loading}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Recognize Face"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 text-center">
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : result.name ? (
              <div>
                <p className="text-cyan-400">✅ Match Found</p>
                <p className="text-lg">
                  <span className="font-bold">{result.name}</span>
                </p>
                <p className="text-sm">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              </div>
            ) : (
               <p className="text-yellow-400">❓ Unknown Face Detected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognitionModal;