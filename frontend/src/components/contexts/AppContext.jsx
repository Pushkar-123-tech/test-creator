// contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedSets, setGeneratedSets] = useState([]);
  const [config, setConfig] = useState({
    platform_name: 'TestGen AI',
    platform_tagline: 'AI Test Generator',
    generate_button_text: 'Generate Test Cases',
    background_color: '#0a0a0f',
    surface_color: '#13131f',
    text_color: '#e8e8f0',
    primary_color: '#6c63ff',
    accent_color: '#00d4aa',
    font_family: 'Syne',
    font_size: 14
  });

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    generatedSets,
    setGeneratedSets,
    config,
    setConfig
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}