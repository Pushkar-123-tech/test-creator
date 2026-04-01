// components/Analytics/AnalyticsDashboard.jsx
import React from 'react';
import { TrendChart } from './TrendChart';
import { Zap, Save, Layers, TrendingUp } from 'lucide-react';

export function AnalyticsDashboard() {
  const stats = [
    { icon: Zap, label: 'Cases Generated', value: '47', change: '+12%', color: '#a78bfa' },
    { icon: Save, label: 'Test Sets Saved', value: '12', change: '+3', color: '#00d4aa' },
    { icon: Layers, label: 'Most Used Module', value: 'Auth', change: 'Popular', color: '#ff6b9d' },
    { icon: TrendingUp, label: 'Total Cases', value: '156', change: '+18%', color: '#f59e0b' },
  ];

  return (
    <div className="p-7">
      <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">Analytics</h1>
      <p className="text-[13px] text-[#66667a] mb-6">Track your test generation activity and insights.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <span className="badge badge-green">{stat.change}</span>
            </div>
            <div className="syne text-[28px] font-extrabold text-[#e8e8f0] leading-tight">{stat.value}</div>
            <div className="text-xs text-[#66667a] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-6">
          <h2 className="syne text-[15px] font-bold text-[#e8e8f0] mb-5">Generation Trend (Last 7 Days)</h2>
          <TrendChart />
        </div>
        
        <div className="glass p-6">
          <h2 className="syne text-[15px] font-bold text-[#e8e8f0] mb-4">By Module</h2>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Authentication', percentage: 34 },
              { name: 'API', percentage: 28 },
              { name: 'UI/UX', percentage: 22 },
              { name: 'Database', percentage: 20 },
              { name: 'Security', percentage: 16 },
            ].map(module => (
              <div key={module.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#c4c4d4]">{module.name}</span>
                  <span className="text-[#a78bfa] font-bold">{module.percentage}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${module.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}