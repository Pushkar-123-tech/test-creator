// App.jsx
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Toast } from './components/Layout/Toast';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TestGenerator } from './components/Generator/TestGenerator';
import { History } from './components/History/History';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { TemplatesGrid } from './components/Templates/TemplatesGrid';
import { Settings } from './components/Settings/Settings';
import { AppProvider, useAppContext } from './components/contexts/AppContext';
import Auth from './components/Auth/Auth';
import { supabase } from './utils/supabase';

function AppContent() {
  const { user, loading } = useAppContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard showToast={showToast} />;
      case 'generator':
        return <TestGenerator showToast={showToast} />;
      case 'history':
        return <History showToast={showToast} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'templates':
        return <TemplatesGrid />;
      case 'settings':
        return <Settings />;
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
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={user} />
      <main className="flex-1 overflow-auto">
        {renderView()}
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