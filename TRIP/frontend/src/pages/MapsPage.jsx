import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { MapPin, Navigation, Search, Map as MapIcon, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mockLocations = [
  { id: 1, name: 'Eiffel Tower', category: 'Attraction', pos: [48.8584, 2.2945] },
  { id: 2, name: 'Louvre Museum', category: 'Museum', pos: [48.8606, 2.3376] },
  { id: 3, name: 'Notre-Dame', category: 'Historical', pos: [48.8529, 2.3500] },
];

export function MapsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show loading state
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-neutral-950 overflow-hidden relative z-0">
      
      {/* Sidebar Overlay (Mobile) / Sidebar (Desktop) */}
      <div className="w-full md:w-96 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-1/3 md:h-full z-10 shadow-xl">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary-600" />
            Explore Map
          </h2>
          <div className="mt-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-transparent rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">Nearby Attractions</h3>
          {mockLocations.map((loc) => (
            <div key={loc.id} className="p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">{loc.name}</h4>
                <p className="text-sm text-neutral-500">{loc.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 h-2/3 md:h-full relative z-0">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <MapIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 animate-pulse mb-4" />
            <p className="text-neutral-500 font-medium">Loading map engine...</p>
          </div>
        ) : (
          <MapContainer 
            center={[48.8566, 2.3522]} 
            zoom={13} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            
            {mockLocations.map(loc => (
              <Marker key={loc.id} position={loc.pos}>
                <Popup className="rounded-xl overflow-hidden shadow-xl border-none">
                  <div className="p-1">
                    <h3 className="font-bold text-sm text-neutral-900">{loc.name}</h3>
                    <p className="text-xs text-neutral-500">{loc.category}</p>
                    <button className="mt-2 text-xs font-semibold text-primary-600 flex items-center gap-1 w-full justify-center bg-primary-50 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                      <Navigation className="w-3 h-3" /> Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

    </div>
  );
}
