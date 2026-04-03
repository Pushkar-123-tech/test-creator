// components/Generator/TestCaseCard.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TestCaseCard({ testCase }) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'badge-pink';
      case 'high': return 'badge-orange';
      default: return 'badge-purple';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:border-[#6c63ff]/40">
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#a78bfa]">TC-{testCase.id}</span>
            <span className={`badge ${getSeverityColor(testCase.severity)}`}>{testCase.severity}</span>
            <span className="badge badge-green">{testCase.type}</span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#e8e8f0] mb-1 leading-tight">{testCase.title}</h3>
          <p className="text-xs sm:text-sm text-[#88889a] line-clamp-2">{testCase.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-2 sm:ml-4 flex-shrink-0">
          <span className="text-xs text-[#66667a] hidden sm:inline">{testCase.coverage}</span>
          {expanded ? <ChevronUp size={16} className="text-[#88889a]" /> : <ChevronDown size={16} className="text-[#88889a]" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
          <div className="text-xs sm:text-sm font-semibold text-[#a78bfa] mb-2">Test Steps:</div>
          <div className="space-y-2 sm:space-y-3">
            {testCase.steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 text-xs sm:text-sm">
                <span className="text-[#a78bfa] font-medium flex-shrink-0">{step.step}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[#e8e8f0] leading-relaxed">{step.action}</div>
                  <div className="text-[#88889a] text-[11px] sm:text-xs mt-1">Expected: {step.expected}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}