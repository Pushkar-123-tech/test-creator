import React from 'react';
import { Zap, History, BarChart2, LayoutTemplate, Sparkles, LogOut, User } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const navItems = {
  main: [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
  ],
  tools: [
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  ]
};

export function Sidebar({ currentView, setCurrentView, user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-6 overflow-y-auto">
      {/* Logo */}
      <div className="pb-8 mb-6 border-b border-gray-700 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">TestGen AI</div>
            <div className="text-xs text-gray-400 font-medium">AI Test Generator</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <div className="text-xs font-bold text-gray-500 tracking-wider px-4 pb-3 uppercase">
          Main
        </div>
        {navItems.main.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentView === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}

        <div className="text-xs font-bold text-gray-500 tracking-wider px-4 pt-6 pb-3 uppercase">
          Tools
        </div>
        {navItems.tools.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentView === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        {user && (
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user.email.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
        <div className="text-[10px] text-gray-600 text-center mt-4">
          v2.1.0 • AI Powered
        </div>
      </div>
    </aside>
  );
}
