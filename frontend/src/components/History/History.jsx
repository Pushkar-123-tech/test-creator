// components/History/History.jsx
import React, { useState, useEffect } from 'react';
import { HistoryGrid } from './HistoryGrid';
import { aiClient } from '../../utils/aiClient';
import { useAppContext } from '../contexts/AppContext';

export function History({ showToast }) {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await aiClient.request(`/api/ai/generations?userId=${user.id}`);
        if (response.success) {
          setHistory(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
        showToast('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, showToast]);

  const filteredHistory = history.filter(item =>
    item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await aiClient.request(`/api/ai/generations/${id}?userId=${user?.id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
        showToast('Test set deleted successfully');
      } else {
        showToast('Failed to delete test set');
      }
    } catch (error) {
      console.error('Error deleting generation:', error);
      showToast('Failed to delete test set');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="text-center py-8 sm:py-12">
          <div className="loading-spinner inline-block"></div>
          <p className="text-sm text-[#66667a] mt-2">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-7 gap-4">
        <div>
          <h1 className="syne text-xl sm:text-2xl lg:text-[22px] font-extrabold text-[#e8e8f0] mb-1">Generation History</h1>
          <p className="text-sm text-[#66667a]">All your previously generated test case sets.</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <input
            type="text"
            className="ai-input w-full sm:w-[220px]"
            placeholder="Search generations…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <HistoryGrid history={filteredHistory} onDelete={handleDelete} />
    </div>
  );
}