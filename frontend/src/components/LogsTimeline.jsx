import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { motion } from 'framer-motion';

export default function LogsTimeline(){
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    API.get('/logs')
      .then(res=>{
        if(mounted){
          setLogs(res.data.logs || []);
        }
      })
      .catch(err=>{
        console.error('Failed to fetch logs', err);
      })
      .finally(()=>setLoading(false));
    return ()=> mounted=false;
  },[]);

  if(loading) return <div className="p-4 text-slate-400">Loading timeline...</div>;

  return (
    <div className="space-y-4">
      {logs.length===0 && <div className="text-slate-400">No logs yet</div>}
      {logs.map((l, idx)=>(
        <motion.div key={idx} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: idx*0.05}} className="flex items-start gap-4">
          <div className="timeline-dot flex-shrink-0" style={{background: l.confidence ? 'linear-gradient(90deg,#00f5ff,#ff3dab)' : '#777'}}></div>
          <div>
            <div className="text-white font-medium">{l.name || 'Unknown'}</div>
            <div className="text-sm text-slate-400">{new Date(l.timestamp).toLocaleString()}</div>
            <div className="text-sm text-slate-300 mt-1">{l.camera_id ? `Camera: ${l.camera_id}` : ''}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
