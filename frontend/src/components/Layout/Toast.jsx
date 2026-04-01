// components/Layout/Toast.jsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function Toast({ message }) {
  return (
    <div className="fixed bottom-7 right-7 bg-gradient-to-r from-[#00d4aa] to-[#6c63ff] text-white px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 z-50 shadow-lg animate-slide-in">
      <CheckCircle2 size={18} />
      <span>{message}</span>
    </div>
  );
}