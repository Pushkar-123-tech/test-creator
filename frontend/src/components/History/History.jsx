// components/History/History.jsx
import React, { useState } from 'react';
import { HistoryGrid } from './HistoryGrid';

const mockHistory = [
  { id: 1, requirement: 'User authentication with email and password', module: 'Auth', testType: 'Functional', cases: 10, date: '2024-01-15' },
  { id: 2, requirement: 'Payment gateway integration with Stripe', module: 'Payment', testType: 'Integration', cases: 15, date: '2024-01-14' },
  { id: 3, requirement: 'Database connection pooling and optimization', module: 'Database', testType: 'Performance', cases: 8, date: '2024-01-13' },
];

export function History({ showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState(mockHistory);

  const filteredHistory = history.filter(item =>
    item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    showToast('Test set deleted successfully');
  };

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