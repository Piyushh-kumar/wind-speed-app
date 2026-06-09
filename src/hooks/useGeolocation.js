import { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await weatherService.getAddressByCoordinates(latitude, longitude);
          setLocation({ latitude, longitude, address });
          setError(null);
        } catch (err) {
          setLocation({ latitude, longitude, address: 'Unknown location' });
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message || 'Failed to get location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { location, error, loading, getCurrentLocation };
};