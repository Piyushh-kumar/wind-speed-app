import React from 'react';

export const WindCompass = ({ direction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="relative w-48 h-48">
        {/* Compass circle */}
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Outer circle */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#e5e7eb" strokeWidth="2" />
          
          {/* Cardinal directions */}
          <text x="100" y="20" textAnchor="middle" className="font-bold text-lg fill-red-500">N</text>
          <text x="180" y="105" textAnchor="middle" className="font-bold text-lg fill-gray-700">E</text>
          <text x="100" y="185" textAnchor="middle" className="font-bold text-lg fill-gray-700">S</text>
          <text x="20" y="105" textAnchor="middle" className="font-bold text-lg fill-gray-700">W</text>

          {/* Intercardinal directions */}
          <text x="145" y="40" textAnchor="middle" className="text-xs fill-gray-500">NE</text>
          <text x="160" y="160" textAnchor="middle" className="text-xs fill-gray-500">SE</text>
          <text x="40" y="160" textAnchor="middle" className="text-xs fill-gray-500">SW</text>
          <text x="40" y="40" textAnchor="middle" className="text-xs fill-gray-500">NW</text>

          {/* Grid lines */}
          <line x1="100" y1="10" x2="100" y2="30" stroke="#d1d5db" strokeWidth="1" />
          <line x1="100" y1="170" x2="100" y2="190" stroke="#d1d5db" strokeWidth="1" />
          <line x1="10" y1="100" x2="30" y2="100" stroke="#d1d5db" strokeWidth="1" />
          <line x1="170" y1="100" x2="190" y2="100" stroke="#d1d5db" strokeWidth="1" />

          {/* Direction pointer */}
          <g transform={`rotate(${direction} 100 100)`}>
            <polygon points="100,30 95,60 100,50 105,60" fill="#0f766e" />
            <line x1="100" y1="50" x2="100" y2="100" stroke="#0f766e" strokeWidth="2" />
          </g>

          {/* Center circle */}
          <circle cx="100" cy="100" r="8" fill="#0f766e" />
        </svg>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">{direction.toFixed(1)}°</p>
    </div>
  );
};