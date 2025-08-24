import React from 'react';
import GlassCard from '../components/GlassCard';

export default function Settings(){

  return (
    <div className='space-y-6'>
      <GlassCard title='System Settings'>
        <div className='text-slate-300'>
          <p>This is the settings page.</p>
          <p className="mt-4">Face registration has been moved to the main dashboard for easier access.</p>
        </div>
      </GlassCard>
    </div>
  );
}