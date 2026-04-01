// components/Settings/Settings.jsx
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-7">
      <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">Settings</h1>
      <p className="text-[13px] text-[#66667a] mb-6">Configure your AI test generator preferences.</p>
      
      <div className="glass p-8 text-center">
        <SettingsIcon size={40} className="text-[#f59e0b] mx-auto mb-3" />
        <p className="syne text-base font-bold text-[#e8e8f0] mb-1.5">Generator Preferences</p>
        <p className="text-[13px] text-[#66667a]">Manage AI model settings, default preferences, and integrations.</p>
      </div>
    </div>
  );
}