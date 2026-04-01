// components/Dashboard/StatsCard.jsx
import React from 'react';
import ProgressBar from '../Common/ProgressBar';

export function StatsCard({ icon: Icon, label, value, change, progress, color }) {
  const isPositive = change.includes('+');

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-opacity-20" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white leading-tight">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
      <ProgressBar progress={progress} color={`linear-gradient(90deg, ${color}, #6c63ff)`} />
    </div>
  );
}