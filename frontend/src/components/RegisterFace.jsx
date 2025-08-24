import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { registerFace } from "../services/api";

export default function RegisterFace() {
  const webcamRef = useRef(null);
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const captureFromWebcam = async () => {
    const shot = webcamRef.current.getScreenshot();
    const blob = await (await fetch(shot)).blob();
    return new File([blob], "capture.jpg", { type: "image/jpeg" });
  };

  const submit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("role", role);

      if (mode === "upload") {
        if (!file) throw new Error("Select file first");
        fd.append("file", file);
      } else {
        const f = await captureFromWebcam();
        fd.append("file", f);
      }

      const res = await registerFace(fd);
      setMsg({ type: "success", text: `✅ Registered ${res.data.name}` });

      // Reset form
      setName("");
      setRole("");
      setFile(null);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.detail || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-3">Register Face</h3>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-3">
        <button
          className={`px-3 py-1 rounded ${
            mode === "upload" ? "bg-cyan-600" : "bg-slate-700"
          }`}
          onClick={() => setMode("upload")}
        >
          Upload
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "webcam" ? "bg-cyan-600" : "bg-slate-700"
          }`}
          onClick={() => setMode("webcam")}
        >
          Webcam
        </button>
      </div>

      {/* Form inputs */}
      <input
        className="w-full mb-2 p-2 bg-slate-900 rounded"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 bg-slate-900 rounded"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      {/* Upload/Webcam */}
      {mode === "upload" ? (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded border border-cyan-500"
        />
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          onClick={() => {
            setName("");
            setRole("");
            setFile(null);
            setMsg(null);
          }}
          className="px-3 py-2 bg-slate-700 rounded"
        >
          Reset
        </button>
      </div>

      {/* Message */}
      {msg && (
        <p
          className={`mt-3 ${
            msg.type === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
