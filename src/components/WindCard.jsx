import React from 'react';

export const WindCard = ({ location, windData, unit = 'm/s' }) => {
  if (!windData) return null;

  const getWindIcon = (speed) => {
    if (speed < 3) return '🌤️';
    if (speed < 7) return '🌬️';
    if (speed < 12) return '💨';
    return '🌪️';
  };

  return (
    <div className="wind-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{location.address}</h3>
          <p className="text-sm text-gray-500">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        </div>
        <span className="text-4xl">{getWindIcon(windData.current.speed)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-sm">Current Wind Speed</p>
          <p className="text-2xl font-bold text-primary">{windData.current.speed.toFixed(1)} {unit}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Wind Direction</p>
          <p className="text-2xl font-bold text-secondary">{windData.current.direction}°</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Wind Gust</p>
          <p className="text-lg font-semibold text-gray-700">{windData.current.gust.toFixed(1)} {unit}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Cardinal Direction</p>
          <p className="text-lg font-semibold text-gray-700">{getWindDirection(windData.current.direction)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Last updated: {new Date(windData.current.timestamp * 1000).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees + 11.25) % 360) / 22.5);
  return directions[index % 16];
};