// components/Templates/TemplatesGrid.jsx
import React from 'react';
import { Lock, CreditCard, Database, Server, Layout, Zap } from 'lucide-react';

const templates = [
  { icon: Lock, title: 'Authentication Tests', desc: 'Login, signup, password reset flows' },
  { icon: CreditCard, title: 'Payment Processing', desc: 'Transaction validation, error handling' },
  { icon: Database, title: 'Database Operations', desc: 'CRUD, constraints, performance' },
  { icon: Server, title: 'API Integration', desc: 'Endpoints, responses, error codes' }, // ✅ FIXED
  { icon: Layout, title: 'UI Interactions', desc: 'Forms, buttons, navigation' },
  { icon: Zap, title: 'Performance', desc: 'Load testing, response times' },
];

export function TemplatesGrid() {
  return (
    <div className="p-7">
      <h1 className="syne text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">Test Templates</h1>
      <p className="text-[13px] text-[#66667a] mb-6">Quick-start templates for common test scenarios.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <div
            key={index}
            className="glass p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6c63ff]/40"
          >
            <div className="w-10 h-10 bg-[#6c63ff]/25 rounded-xl flex items-center justify-center mb-3.5">
              <template.icon size={20} color="#a78bfa" />
            </div>
            <h3 className="syne text-sm font-bold text-[#e8e8f0] mb-1">{template.title}</h3>
            <p className="text-xs text-[#66667a] m-0">{template.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}