// components/Templates/TemplatesGrid.jsx
import React from 'react';
import { Lock, CreditCard, Database, Server, Layout, Zap } from 'lucide-react';

const templates = [
  { 
    icon: Lock, 
    title: 'Authentication Tests', 
    desc: 'Login, signup, password reset flows',
    requirement: 'Create comprehensive test cases for user authentication including login with valid/invalid credentials, signup with various email formats, password reset functionality, session management, and security validations.'
  },
  { 
    icon: CreditCard, 
    title: 'Payment Processing', 
    desc: 'Transaction validation, error handling',
    requirement: 'Generate test cases for payment processing system covering successful transactions, failed payments, refund processing, currency conversions, payment method validations, and error scenarios.'
  },
  { 
    icon: Database, 
    title: 'Database Operations', 
    desc: 'CRUD, constraints, performance',
    requirement: 'Create test cases for database operations including Create, Read, Update, Delete operations, data validation constraints, foreign key relationships, indexing performance, and concurrent access scenarios.'
  },
  { 
    icon: Server, 
    title: 'API Integration', 
    desc: 'Endpoints, responses, error codes',
    requirement: 'Generate comprehensive API test cases covering all endpoints, request/response validation, authentication headers, error status codes, rate limiting, and integration with external services.'
  },
  { 
    icon: Layout, 
    title: 'UI Interactions', 
    desc: 'Forms, buttons, navigation',
    requirement: 'Create test cases for user interface interactions including form submissions, button clicks, navigation flows, responsive design, accessibility features, and cross-browser compatibility.'
  },
  { 
    icon: Zap, 
    title: 'Performance', 
    desc: 'Load testing, response times',
    requirement: 'Generate performance test cases covering load testing scenarios, response time validations, memory usage monitoring, database query optimization, and scalability testing under various user loads.'
  },
];

export function TemplatesGrid({ onSelectTemplate }) {
  const handleTemplateClick = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7">
      <h1 className="syne text-xl sm:text-2xl lg:text-[22px] font-extrabold text-[#e8e8f0] mb-1.5">Test Templates</h1>
      <p className="text-sm text-[#66667a] mb-4 sm:mb-6">Quick-start templates for common test scenarios.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <div
            key={index}
            className="glass p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6c63ff]/40"
            onClick={() => handleTemplateClick(template)}
          >
            <div className="w-10 h-10 bg-[#6c63ff]/25 rounded-xl flex items-center justify-center mb-3 sm:mb-3.5 flex-shrink-0">
              <template.icon size={20} color="#a78bfa" />
            </div>
            <h3 className="syne text-sm font-bold text-[#e8e8f0] mb-1 leading-tight">{template.title}</h3>
            <p className="text-xs text-[#66667a] m-0 leading-relaxed">{template.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}