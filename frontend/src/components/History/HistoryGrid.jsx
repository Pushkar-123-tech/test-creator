// components/History/HistoryGrid.jsx
import React from 'react';
import { Zap, Trash2 } from 'lucide-react';

export function HistoryGrid({ history, onDelete }) {
  if (history.length === 0) {
    return (
      <div className="glass p-12 text-center">
        <Zap size={40} className="text-[#a78bfa] mx-auto mb-3" />
        <p className="text-[#e8e8f0] font-semibold">No history found</p>
        <p className="text-sm text-[#66667a]">Generate your first test cases to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="glass p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6c63ff]/40"
        >
          <div className="flex items-start justify-between mb-3.5">
            <div className="w-10 h-10 bg-[#6c63ff]/25 rounded-xl flex items-center justify-center">
              <Zap size={20} color="#a78bfa" />
            </div>
            <span className="badge badge-purple">Generated</span>
          </div>
          <h3 className="syne text-sm font-bold text-[#e8e8f0] mb-1">
            {item.requirement.substring(0, 40)}...
          </h3>
          <p className="text-xs text-[#66667a] mb-3">
            {item.module} · {item.testType}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#66667a] mb-3">
            <span><strong>{item.cases}</strong> cases</span>
            <span>·</span>
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <button
            className="btn-ghost w-full py-2 text-xs flex items-center justify-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      ))}
    </div>
  );
}