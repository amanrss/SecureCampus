import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// MODIFIED: Added FaUserShield
import { FaHome, FaTachometerAlt, FaList, FaCog, FaBars, FaVideo, FaUserShield } from 'react-icons/fa';

const items = [
  { name: 'Home', to: '/home', icon: <FaHome /> },
  { name: 'Dashboard', to: '/dashboard', icon: <FaTachometerAlt /> },
  { name: 'Live Feed', to: '/live-feed', icon: <FaVideo /> },
  { name: 'Logs', to: '/logs', icon: <FaList /> },
  { name: 'Admin Panel', to: '/admin', icon: <FaUserShield /> }, // ADDED
  { name: 'Settings', to: '/settings', icon: <FaCog /> },
];

// ... the rest of the file is unchanged ...
export default function Sidebar(){
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 80 }}
      className={`flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-black/60 backdrop-blur-md border-r border-white/6`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-black font-bold">SC</div>
          {!collapsed && <div>
            <div className="text-white font-bold text-lg">SecureCampus</div>
            <div className="text-xs text-slate-400">Command Center</div>
          </div>}
        </div>
        <button onClick={()=>setCollapsed(c=>!c)} className="text-slate-300 p-2 hover:text-white">
          <FaBars />
        </button>
      </div>

      <nav className="p-4 flex-1">
        {items.map(it => (
          <NavLink key={it.to} to={it.to}
            className={({isActive}) => `flex items-center gap-3 p-3 rounded-md mb-2 transition-colors ${
              isActive ? 'bg-white/6 text-cyan-300' : 'text-slate-300 hover:bg-white/3'
            }`}
          >
            <div className="text-xl">{it.icon}</div>
            {!collapsed && <div className="font-medium">{it.name}</div>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/6">
        <div className="text-xs text-slate-400 mb-2">{collapsed ? '' : 'Quick Actions'}</div>
        <div className="flex gap-2">
          <button className="btn-neon w-full">Alert</button>
        </div>
      </div>
    </motion.aside>
  );
}