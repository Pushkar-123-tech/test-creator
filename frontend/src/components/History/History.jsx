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
      <div className="p-7">
        <div className="text-center py-12">
          <div className="loading-spinner inline-block"></div>
          <p className="text-sm text-[#66667a] mt-2">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1">Generation History</h1>
          <p className="text-[13px] text-[#66667a]">All your previously generated test case sets.</p>
        </div>
        <div className="flex gap-2.5">
          <input
            type="text"
            className="ai-input w-[220px]"
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