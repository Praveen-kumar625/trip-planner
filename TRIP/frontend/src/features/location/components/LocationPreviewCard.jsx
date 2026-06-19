import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MapPin, Thermometer, Cloud, Globe, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '200px',
  borderRadius: '16px',
};

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a8d8ea' }] },
  ],
};

/**
 * LocationPreviewCard — Shows destination details after selection.
 * Includes: formatted address, city/state/country, lat/lng, timezone,
 * mini interactive Google Map with marker, and live weather preview.
 */
export function LocationPreviewCard({ location, className = '' }) {
  const { isLoaded } = useGooglePlaces();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(false);
      try {
        const res = await fetch(
          `https://wttr.in/${location.latitude},${location.longitude}?format=j1`
        );
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        const current = data.current_condition?.[0];
        if (current) {
          setWeather({
            temp: current.temp_C,
            feelsLike: current.FeelsLikeC,
            condition: current.weatherDesc?.[0]?.value || 'Unknown',
            humidity: current.humidity,
            windSpeed: current.windspeedKmph,
          });
        }
      } catch {
        setWeatherError(true);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [location?.latitude, location?.longitude]);

  if (!location) return null;

  const center = { lat: location.latitude, lng: location.longitude };

  return (
    <div className={`bg-white border border-neutral-100 rounded-3xl shadow-premium overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-neutral-900">{location.city || location.name}</h3>
            <p className="text-sm text-neutral-500 font-medium">
              {[location.state, location.country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Mini Map */}
          {isLoaded && (
            <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={center}
                zoom={11}
                options={MAP_OPTIONS}
                onLoad={(map) => { mapRef.current = map; }}
              >
                <Marker position={center} />
              </GoogleMap>
            </div>
          )}

          {/* Weather Preview */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-100">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-4 h-4 text-sky-500" />
              <span className="text-sm font-semibold text-sky-700">Current Weather</span>
            </div>
            {weatherLoading ? (
              <div className="flex items-center gap-2 text-sky-400 text-sm">
                <div className="w-4 h-4 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                <span>Fetching weather data...</span>
              </div>
            ) : weatherError ? (
              <p className="text-sm text-sky-400">Weather data temporarily unavailable.</p>
            ) : weather ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{weather.temp}°C</p>
                    <p className="text-xs text-neutral-500">Feels like {weather.feelsLike}°C</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700">{weather.condition}</p>
                  <p className="text-xs text-neutral-500">Humidity: {weather.humidity}%</p>
                  <p className="text-xs text-neutral-500">Wind: {weather.windSpeed} km/h</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={Globe} label="Country" value={`${location.country} (${location.countryCode})`} />
            <DetailItem icon={MapPin} label="Coordinates" value={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`} />
            {location.timezone && (
              <DetailItem icon={Clock} label="Timezone" value={location.timezone} />
            )}
            {location.state && (
              <DetailItem icon={MapPin} label="State/Region" value={location.state} />
            )}
          </div>

          {/* Full Address */}
          <div className="px-3 py-2 bg-neutral-50 rounded-xl">
            <p className="text-xs text-neutral-400 font-medium mb-0.5">Full Address</p>
            <p className="text-sm text-neutral-700 font-medium">{location.formattedAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl">
      <Icon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        <p className="text-sm text-neutral-700 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
