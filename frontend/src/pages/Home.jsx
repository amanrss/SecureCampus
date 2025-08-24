import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

export default function Home(){
  return (
    <div className="space-y-6">
      <motion.h2 className="text-3xl font-bold neon-text" initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>SecureCampus Command Center</motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard title="System Health">
          <div className="text-slate-300">All systems nominal. No critical alerts.</div>
        </GlassCard>
        <GlassCard title="Today's Summary">
          <div className="text-slate-300">Recognitions: 128<br/>Alerts: 4<br/>Cameras online: 12</div>
        </GlassCard>
        <GlassCard title="Notifications">
          <div className="text-slate-300">You have 3 unread alerts. <button className="btn-neon ml-3">View</button></div>
        </GlassCard>
      </div>
    </div>
  );
}
