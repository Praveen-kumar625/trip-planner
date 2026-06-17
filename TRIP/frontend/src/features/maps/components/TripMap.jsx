import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MarkersAndClusterer = ({ destinations, onMarkerClick, activeMarker }) => {
  const map = useMap();
  const clusterer = useRef(null);
  const [markers, setMarkers] = useState({});

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(Object.values(markers));
    }
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;
    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {destinations.map((dest, index) => {
        if (!dest.coordinates) return null;
        const isActive = activeMarker === dest.id;
        return (
          <AdvancedMarker
            key={dest.id || index}
            position={{ lat: dest.coordinates.lat, lng: dest.coordinates.lng }}
            ref={marker => setMarkerRef(marker, dest.id || index)}
            onClick={() => onMarkerClick(dest.id)}
          >
            <Pin
              background={isActive ? '#4f46e5' : '#ef4444'}
              borderColor={isActive ? '#312e81' : '#7f1d1d'}
              glyphColor="#fff"
              scale={isActive ? 1.2 : 1}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export const TripMap = ({ destinations = [], center = { lat: 20.5937, lng: 78.9629 }, zoom = 5 }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Google Maps API Key is missing.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-900">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="wandersync_map_id"
          disableDefaultUI={true}
          zoomControl={true}
          gestureHandling="greedy"
        >
          <MarkersAndClusterer 
            destinations={destinations} 
            activeMarker={activeMarker}
            onMarkerClick={setActiveMarker}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default TripMap;
