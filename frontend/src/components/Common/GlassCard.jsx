// components/Common/GlassCard.jsx
import React from 'react';

export function GlassCard({ children, className = '', bright = false }) {
  return (
    <div className={`${bright ? 'glass-bright' : 'glass'} ${className}`}>
      {children}
    </div>
  );
}