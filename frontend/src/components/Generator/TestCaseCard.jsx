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
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-200 hover:border-[#6c63ff]/40">
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#a78bfa]">TC-{testCase.id}</span>
            <span className={`badge ${getSeverityColor(testCase.severity)}`}>{testCase.severity}</span>
            <span className="badge badge-green">{testCase.type}</span>
          </div>
          <h3 className="text-sm font-semibold text-[#e8e8f0] mb-1">{testCase.title}</h3>
          <p className="text-xs text-[#88889a]">{testCase.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-[#66667a]">{testCase.coverage}</span>
          {expanded ? <ChevronUp size={16} className="text-[#88889a]" /> : <ChevronDown size={16} className="text-[#88889a]" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs font-semibold text-[#a78bfa] mb-2">Test Steps:</div>
          <div className="space-y-2">
            {testCase.steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 text-xs">
                <span className="text-[#a78bfa] font-medium">{step.step}.</span>
                <div className="flex-1">
                  <div className="text-[#e8e8f0]">{step.action}</div>
                  <div className="text-[#88889a] text-[11px]">Expected: {step.expected}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}