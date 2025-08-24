// MODIFIED: Accept new props
export default function Navbar({ campusStatus, resetCampusStatus }) {
  return (
    <nav className="bg-gray-900 border-b border-cyan-500 shadow-lg shadow-cyan-500/20 p-4 flex justify-between items-center relative">
      <h1 className="text-cyan-400 text-2xl font-bold tracking-wider">⚡ SecureCampus 2.0</h1>
      
      {/* --- ADDED: The persistent campus-wide alert banner --- */}
      {campusStatus === 'critical' && (
        <div className="absolute top-full left-0 right-0 bg-red-600 text-white text-center py-1 px-4 flex justify-center items-center gap-4 animate-pulse">
          <span className="font-bold">CRITICAL ALERT: Banned Person Detected on Campus</span>
          <button 
            onClick={resetCampusStatus}
            className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/40 rounded"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* --- END of banner --- */}

      <div className="flex gap-4">
        {/* These buttons are decorative, navigation is handled by the sidebar */}
        <button className="text-gray-300 hover:text-cyan-400 transition">Home</button>
        <button className="text-gray-300 hover:text-cyan-400 transition">Dashboard</button>
        <button className="text-gray-300 hover:text-cyan-400 transition">Logs</button>
        <button className="text-gray-300 hover:text-cyan-400 transition">Settings</button>
      </div>
    </nav>
  );
}