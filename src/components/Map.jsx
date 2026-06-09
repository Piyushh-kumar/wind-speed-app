import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
    }
  });
  return null;
};

export const Map = ({ locations, onMapClick, selectedLocation }) => {
  const [center, setCenter] = useState([20, 78]); // Default to India center

  useEffect(() => {
    if (selectedLocation) {
      setCenter([selectedLocation.latitude, selectedLocation.longitude]);
    }
  }, [selectedLocation]);

  return (
    <div className="map-container w-full h-96 md:h-screen rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapClick={onMapClick} />

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{location.address}</p>
                <p>Wind Speed: {location.windData?.current.speed.toFixed(1)} m/s</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};