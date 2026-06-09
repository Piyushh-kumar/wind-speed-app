# Wind Speed App 🌬️

A location-based wind speed application that provides real-time wind data at different altitudes and geographical locations.

## Features

✨ **Core Features:**
- 🗺️ Interactive map for location selection
- 📍 Real-time geolocation detection
- 💨 Wind speed at multiple altitudes (ground level, 10m, 50m+)
- 🌍 Geographical awareness (terrain, coastal, urban areas)
- 📊 Wind speed comparison across locations
- 📈 Hourly & daily forecasts
- 📱 Fully responsive mobile design
- 🌓 Dark/Light mode support

## Tech Stack

- **Frontend:** React.js with Vite
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet.js + OpenStreetMap
- **Weather Data:** OpenWeatherMap API
- **State Management:** React Hooks
- **HTTP Client:** Axios

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- OpenWeatherMap API key (get free at https://openweathermap.org/api)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Piyushh-kumar/wind-speed-app.git
cd wind-speed-app
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start development server
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Project Structure

```
wind-speed-app/
├── src/
│   ├── components/
│   │   ├── Map.jsx
│   │   ├── WindCard.jsx
│   │   ├── LocationSearch.jsx
│   │   └── WindCompass.jsx
│   ├── services/
│   │   └── weatherService.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## API Integration

Using OpenWeatherMap One Call API 3.0:
- Current weather data
- Minute-by-minute forecast (1 hour)
- Hourly forecast (48 hours)
- Daily forecast (8 days)
- Wind speed at different altitudes

## Usage

1. **Allow Geolocation:** Click "Use My Location" to auto-detect your position
2. **Pin Location:** Click on the map to select a specific location
3. **Search Location:** Use the search bar to find cities
4. **View Wind Data:** See wind speed at different altitudes
5. **Compare:** Add multiple locations to compare wind speeds

## Environment Variables

```
VITE_OPENWEATHER_API_KEY    - Your OpenWeatherMap API key (free tier)
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

Feel free to fork, create feature branches, and submit pull requests!

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Made with ❤️ by Piyushh-kumar**
