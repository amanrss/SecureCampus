import React, { useEffect, useState } from "react";
import axios from "../services/axiosClient";
import LogsTimeline from "./LogsTimeline";

export default function AdminDashboard() {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const fetchFaces = async () => {
    setLoading(true);
    const res = await axios.get("/faces/list");
    setFaces(res.data.faces || []);
    setLoading(false);
  };

  useEffect(()=>{ fetchFaces(); }, []);

  const remove = async (id) => {
    await axios.delete(`/faces/${id}`);
    fetchFaces();
  };

  const startEdit = (f) => { setEditing(f.id); setName(f.name); setRole(f.role || ""); };
  const saveEdit = async () => {
    await axios.put(`/faces/${editing}`, { name, role });
    setEditing(null); fetchFaces();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <div className="card mb-6">
        <h3 className="font-semibold mb-2">Registered Faces</h3>
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left">
            <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {faces.map(f => (
                <tr key={f.id} className="border-t border-slate-700">
                  <td>{editing===f.id ? <input className="p-1 bg-slate-900" value={name} onChange={e=>setName(e.target.value)} /> : f.name}</td>
                  <td>{editing===f.id ? <input className="p-1 bg-slate-900" value={role} onChange={e=>setRole(e.target.value)} /> : f.role}</td>
                  <td className="py-2">
                    {editing===f.id ? (<>
                      <button onClick={saveEdit} className="px-3 py-1 bg-emerald-500 rounded mr-2">Save</button>
                      <button onClick={()=>setEditing(null)} className="px-3 py-1 bg-slate-700 rounded">Cancel</button>
                    </>) : (<>
                      <button onClick={()=>startEdit(f)} className="px-3 py-1 bg-cyan-500 rounded mr-2">Edit</button>
                      <button onClick={()=>remove(f.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                    </>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <LogsTimeline />
    </div>
  );
}
