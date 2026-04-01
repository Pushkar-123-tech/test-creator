// components/Dashboard/AIPanel.jsx
import React, { useState } from 'react';
import { Zap, Lightbulb, Target, Shuffle } from 'lucide-react';

export default function AIPanel({ showToast }) {
  const [description, setDescription] = useState('');
  const [testType, setTestType] = useState('Functional');
  const [testLevel, setTestLevel] = useState('Integration Test');

  const tips = [
    { icon: Lightbulb, text: 'AI analyzes code to generate comprehensive edge case test scenarios' },
    { icon: Target, text: 'Set severity levels for prioritized test execution' },
    { icon: Shuffle, text: 'Auto-generate test data matrices for data-driven testing' },
  ];

  const handleGenerate = () => {
    if (!description.trim()) {
      showToast('Please describe the feature or scenario');
      return;
    }
    showToast('Generating test cases...');
    // Navigate to generator view with pre-filled data
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Generator Panel */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 rounded-lg border border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-purple-400" />
          <h3 className="syne text-[15px] font-bold text-[#e8e8f0] m-0">AI Test Generator</h3>
        </div>
        
        <textarea
          className="ai-input"
          rows="3"
          placeholder="Describe the feature or scenario… e.g. 'Create test cases for user registration flow with validation'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <select className="ai-input py-2.5 px-3" value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option>Functional</option>
            <option>Regression</option>
            <option>Performance</option>
            <option>Security</option>
          </select>
          <select className="ai-input py-2.5 px-3" value={testLevel} onChange={(e) => setTestLevel(e.target.value)}>
            <option>Unit Test</option>
            <option>Integration Test</option>
            <option>E2E Test</option>
            <option>API Test</option>
          </select>
        </div>
        
        <button className="btn-primary w-full py-3 mt-2.5 text-sm flex items-center justify-center gap-2" onClick={handleGenerate}>
          <Zap size={16} /> Generate Test Cases
        </button>
      </div>

      {/* Tips Panel */}
      <div className="glass p-5">
        <div className="text-xs font-semibold text-[#a78bfa] tracking-wide uppercase mb-3">QA Tips</div>
        <div className="flex flex-col gap-2.5">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-[#6c63ff]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <tip.icon size={14} color="#a78bfa" />
              </div>
              <p className="text-xs text-[#88889a] leading-relaxed m-0">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}