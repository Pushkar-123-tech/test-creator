
// components/Analytics/TrendChart.jsx
import React from 'react';

export function TrendChart() {
  const data = [8, 12, 10, 15, 18, 14, 9];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const maxHeight = 140;

  return (
    <div className="flex items-end gap-2 h-[140px] pb-1">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-[#6c63ff] to-[#6c63ff]/30 rounded-t-md transition-opacity cursor-pointer hover:opacity-80"
            style={{ height: `${(value / Math.max(...data)) * maxHeight}px` }}
          ></div>
          <span className="text-[9px] text-[#44445a]">{days[index]}</span>
        </div>
      ))}
    </div>
  );
}
