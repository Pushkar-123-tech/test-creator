// App.jsx
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Toast } from './components/Layout/Toast';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TestGenerator } from './components/Generator/TestGenerator';
import { History } from './components/History/History';
import { TemplatesGrid } from './components/Templates/TemplatesGrid';
import { AppProvider, useAppContext } from './components/contexts/AppContext';
import Auth from './components/Auth/Auth';
import { supabase } from './utils/supabase';

function AppContent() {
  const { user, loading } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentView('generator');
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard showToast={showToast} />;
      case 'generator':
        return <TestGenerator showToast={showToast} selectedTemplate={selectedTemplate} onTemplateUsed={() => setSelectedTemplate(null)} />;
      case 'history':
        return <History showToast={showToast} />;
      case 'templates':
        return <TemplatesGrid onSelectTemplate={handleTemplateSelect} />;
      default:
        return <Dashboard showToast={showToast} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => showToast('Successfully logged in!')} />;
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg border border-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="min-h-screen">
          {renderView()}
        </div>
      </main>

      {toast.show && <Toast message={toast.message} />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;