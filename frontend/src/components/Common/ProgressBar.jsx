// components/Common/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({ progress, color = 'linear-gradient(90deg, #6c63ff, #00d4aa)' }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%`, background: color }}
      ></div>
    </div>
  );
}