import { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { darkMapStyle } from './mapStyles';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '24px'
};

// Default center to Taj Mahal
const defaultCenter = {
  lat: 27.1751,
  lng: 78.0421
};

export function MapCanvas({ markers = [], center = defaultCenter, zoom = 12 }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const mapRef = useRef(null);

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-surface-900 animate-pulse rounded-3xl" />;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/5">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C7.58 0 4 3.58 4 8C4 14 12 24 12 24C12 24 20 14 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" fill="#D97706"/></svg>'),
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
