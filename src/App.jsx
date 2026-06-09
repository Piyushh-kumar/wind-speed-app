import React, { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { WindCard } from './components/WindCard';
import { WindCompass } from './components/WindCompass';
import { LocationSearch } from './components/LocationSearch';
import { useGeolocation } from './hooks/useGeolocation';
import { weatherService } from './services/weatherService';
import './styles/globals.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('m/s');
  const { location: currentLocation, getCurrentLocation } = useGeolocation();

  // Fetch weather data when location is selected
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

  // Fetch weather data when current location is available
  useEffect(() => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [currentLocation]);

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      const weatherData = await weatherService.getWeatherByCoords(
        location.latitude,
        location.longitude
      );
      const windData = weatherService.getWindData(weatherData);
      
      const newLocation = {
        ...location,
        windData,
        id: Date.now()
      };

      setLocations(prev => {
        const existing = prev.findIndex(l => 
          Math.abs(l.latitude - location.latitude) < 0.01 && 
          Math.abs(l.longitude - location.longitude) < 0.01
        );
        
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newLocation;
          return updated;
        }
        return [...prev, newLocation];
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
      alert('Failed to fetch weather data. Please check your API key.');
    }
  };

  const handleMapClick = async (coords) => {
    try {
      const address = await weatherService.getAddressByCoordinates(coords.latitude, coords.longitude);
      const location = {
        ...coords,
        address: address.name || 'Unknown location'
      };
      setSelectedLocation(location);
    } catch (error) {
      const location = {
        ...coords,
        address: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
      };
      setSelectedLocation(location);
    }
  };

  const handleLocationSearch = (location) => {
    setSelectedLocation(location);
  };

  const convertWindSpeed = (speed) => {
    return weatherService.convertWindSpeed(speed, 'm/s', unit);
  };

  const removeLocation = (id) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌬️</span>
              <h1 className="text-3xl font-bold text-primary">Wind Speed App</h1>
            </div>
            <div className="flex gap-3">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="m/s">m/s</option>
                <option value="km/h">km/h</option>
                <option value="mph">mph</option>
              </select>
              <button
                onClick={getCurrentLocation}
                className="btn-primary"
              >
                📍 My Location
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <LocationSearch onLocationSelect={handleLocationSearch} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-3xl">⏳</div>
            <p className="text-gray-600 mt-2">Fetching wind data...</p>
          </div>
        )}

        {/* Map and Current Location */}
        {selectedLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Map
                locations={locations}
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
              />
            </div>

            <div className="space-y-4">
              {/* Wind Compass */}
              {selectedLocation.windData && (
                <WindCompass direction={selectedLocation.windData.current.direction} />
              )}

              {/* Unit Info */}
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
                <p>📊 Displaying wind speeds in <strong>{unit}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Wind Data Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location Details</h2>
          
          {locations.length === 0 && selectedLocation && !loading && (
            <p className="text-gray-500 text-center py-8">Loading location data...</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="relative">
                <WindCard
                  location={location}
                  windData={location.windData}
                  unit={unit}
                />
                <button
                  onClick={() => removeLocation(location.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Forecast */}
        {selectedLocation && locations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hourly Forecast</h2>
            <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
              <div className="flex gap-4">
                {locations[0].windData.hourly.slice(0, 12).map((hour, index) => (
                  <div key={index} className="flex-shrink-0 text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(hour.timestamp * 1000).getHours()}:00
                    </p>
                    <p className="font-bold text-lg text-primary">
                      {convertWindSpeed(hour.speed).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">{unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          <p>🌍 Wind Speed App | Powered by OpenWeatherMap & OpenStreetMap</p>
          <p className="mt-2 text-gray-400">Get accurate wind data for any location on Earth</p>
        </div>
      </footer>
    </div>
  );
}

export default App;