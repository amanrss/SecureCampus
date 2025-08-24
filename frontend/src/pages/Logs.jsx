import React from 'react';
import GlassCard from '../components/GlassCard';
import LogsTimeline from '../components/LogsTimeline';
import { exportLogsCsv } from '../services/api';

export default function Logs(){
  const exportCsv = () => {
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/logs/export';
    window.open(url, '_blank');
  };

  return (
    <div className='space-y-6'>
      <GlassCard title='Logs'>
        <div className='flex items-center justify-between mb-4'>
          <div className='text-slate-300'>Incident timeline</div>
          <div>
            <button onClick={exportCsv} className='btn-neon'>Export CSV</button>
          </div>
        </div>
        <LogsTimeline />
      </GlassCard>
    </div>
  );
}
