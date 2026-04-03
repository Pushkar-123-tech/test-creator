// components/Generator/AISettings.jsx
import React from 'react';
import { Settings } from 'lucide-react';

export default function AISettings({ settings, setSettings }) {
  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Settings size={18} className="text-primary-400" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Settings</h3>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.edgeCases}
            onChange={() => handleSettingChange('edgeCases')}
            className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-primary-500 checked:border-primary-500 focus:ring-0 focus:ring-offset-0 focus:border-primary-400 transition-all duration-200 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-slate-200 font-medium group-hover:text-white transition-colors text-sm sm:text-base">Include edge cases</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Generate boundary and extreme scenario tests</p>
          </div>
        </label>

        <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.negativeTests}
            onChange={() => handleSettingChange('negativeTests')}
            className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-primary-500 checked:border-primary-500 focus:ring-0 focus:ring-offset-0 focus:border-primary-400 transition-all duration-200 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-slate-200 font-medium group-hover:text-white transition-colors text-sm sm:text-base">Generate negative tests</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Include failure and error condition tests</p>
          </div>
        </label>

        <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={settings.autoPrioritize}
            onChange={() => handleSettingChange('autoPrioritize')}
            className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800/50 checked:bg-primary-500 checked:border-primary-500 focus:ring-0 focus:ring-offset-0 focus:border-primary-400 transition-all duration-200 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-slate-200 font-medium group-hover:text-white transition-colors text-sm sm:text-base">Auto-prioritize test cases</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rank tests by importance and risk</p>
          </div>
        </label>
      </div>
    </div>
  );
}