import React, { useState, useEffect } from 'react';
import { StatsCard } from './StatsCard';
import RecentTests from './RecentTests';
import { FileText, CheckCircle, Bug, TrendingUp } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { aiClient } from '../../utils/aiClient';

export function Dashboard({ showToast }) {
  const { user } = useAppContext();
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      try {
        const response = await aiClient.request(`/api/ai/analytics?userId=${user.id}`);
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchAnalytics();
  }, [user]);

  const stats = [
    { 
      icon: FileText, 
      label: 'Test Cases Created', 
      value: statsData?.totalTestCases?.toString() || '0', 
      change: '+0%', 
      progress: 0, 
      color: '#a78bfa' 
    },
    { icon: TrendingUp, label: 'Active Sessions', value: '1', change: 'Steady', progress: 100, color: '#f59e0b' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
        <div className="pt-12 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-400 text-base lg:text-lg">Track your software testing progress and coverage metrics.</p>
        </div>
        <div className="flex items-center gap-3 lg:justify-end">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <RecentTests />
      </div>
    </div>
  );
}