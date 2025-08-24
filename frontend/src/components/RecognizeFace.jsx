import React, { useRef, useState } from "react";
import axios from "../services/axiosClient";
import Webcam from "react-webcam";

export default function RecognizeFace() {
  const webcamRef = useRef(null);
  const [mode, setMode] = useState("webcam");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureFromWebcam = async () => {
    const shot = webcamRef.current.getScreenshot();
    const blob = await (await fetch(shot)).blob();
    return new File([blob], "capture.jpg", { type: "image/jpeg" });
  };

  const send = async () => {
    try {
      setLoading(true); setResult(null);
      let f = file;
      if (mode === "webcam") f = await captureFromWebcam();
      const fd = new FormData();
      fd.append("file", f);
      const res = await axios.post("/face/recognize", fd, { headers: { "Content-Type": "multipart/form-data" }});
      setResult(res.data);
    } catch (err) {
      setResult({ error: err?.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-3">Recognize Face</h3>
      <div className="flex gap-2 mb-3">
        <button className={`px-3 py-1 ${mode==="webcam"?"bg-cyan-600":"bg-slate-700"}`} onClick={()=>setMode("webcam")}>Webcam</button>
        <button className={`px-3 py-1 ${mode==="upload"?"bg-cyan-600":"bg-slate-700"}`} onClick={()=>setMode("upload")}>Upload</button>
      </div>

      {mode==="upload" ? (
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
      ) : (
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={send} className="px-4 py-2 bg-emerald-500 rounded">{loading ? "Processing..." : "Recognize"}</button>
        <button onClick={()=>{setFile(null); setResult(null)}} className="px-3 py-2 bg-slate-700 rounded">Reset</button>
      </div>

      {result && (
        <div className="mt-4">
          {result.status === "success" ? (
            <div>
              <p className="text-cyan-300 font-semibold">Matched: {result.name}</p>
              <p>Role: {result.role}</p>
              <p>Confidence: {result.confidence}</p>
            </div>
          ) : result.status === "unknown" ? (
            <p className="text-yellow-300">Unknown face (best distance {result.distance})</p>
          ) : result.status === "no_face" ? (
            <p className="text-red-400">No face detected</p>
          ) : (
            <pre className="text-red-400">{JSON.stringify(result)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
