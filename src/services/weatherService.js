import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

if (!API_KEY) {
  console.error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in .env.local');
}

export const weatherService = {
  // Get weather data for a specific location
  getWeatherByCoords: async (latitude, longitude) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric',
          exclude: 'minutely'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  // Get geocoding data (convert address to coordinates)
  getCoordinatesByAddress: async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1
        }
      });
      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon), address: display_name };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw error;
    }
  },

  // Get reverse geocoding (convert coordinates to address)
  getAddressByCoordinates: async (latitude, longitude) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json'
        }
      });
      return response.data.address;
    } catch (error) {
      console.error('Error getting address:', error);
      throw error;
    }
  },

  // Extract wind data from weather response
  getWindData: (weatherData) => {
    const current = weatherData.current;
    const hourly = weatherData.hourly || [];
    
    return {
      current: {
        speed: current.wind_speed,
        direction: current.wind_deg,
        gust: current.wind_gust || 0,
        timestamp: current.dt
      },
      hourly: hourly.slice(0, 24).map(hour => ({
        speed: hour.wind_speed,
        direction: hour.wind_deg,
        gust: hour.wind_gust || 0,
        timestamp: hour.dt
      })),
      daily: weatherData.daily || []
    };
  },

  // Convert wind direction degree to cardinal direction
  getWindDirection: (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees + 11.25) % 360) / 22.5);
    return directions[index % 16];
  },

  // Convert wind speed between units
  convertWindSpeed: (speed, fromUnit = 'm/s', toUnit = 'km/h') => {
    const conversions = {
      'm/s': { 'km/h': s => s * 3.6, 'mph': s => s * 2.237, 'm/s': s => s },
      'km/h': { 'm/s': s => s / 3.6, 'mph': s => s / 1.609, 'km/h': s => s },
      'mph': { 'm/s': s => s / 2.237, 'km/h': s => s * 1.609, 'mph': s => s }
    };
    return conversions[fromUnit]?.[toUnit]?.(speed) ?? speed;
  }
};