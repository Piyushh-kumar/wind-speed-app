import React, { useState } from 'react';
import { weatherService } from '../services/weatherService';

export const LocationSearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleSelectLocation = (suggestion) => {
    const location = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name
    };
    onLocationSelect(location);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {loading && <div className="absolute right-3 top-2 animate-spin">⏳</div>}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
            >
              <p className="font-semibold text-gray-800">{suggestion.name}</p>
              <p className="text-xs text-gray-500">{suggestion.display_name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};