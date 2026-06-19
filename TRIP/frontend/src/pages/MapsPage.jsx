import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { MapPin, Navigation, Search, Map as MapIcon, Compass, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveImage } from '@/components/ui/Image';
import { BottomSheet } from '@/components/ui/BottomSheet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MOCK_LOCATIONS = [
  { id: 1, name: 'Eiffel Tower', category: 'Attraction', rating: 4.9, image: 'https://images.unsplash.com/photo-1543305113-82b46af139df?q=80&w=600&auto=format&fit=crop', pos: [48.8584, 2.2945] },
  { id: 2, name: 'Louvre Museum', category: 'Museum', rating: 4.8, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop', pos: [48.8606, 2.3376] },
  { id: 3, name: 'Notre-Dame', category: 'Historical', rating: 4.7, image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=600&auto=format&fit=crop', pos: [48.8529, 2.3500] },
];

export function MapsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden relative z-0">
      
      <div className="w-full md:w-[400px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-1/3 md:h-full z-10 shadow-premium shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 font-serif">
            <Compass className="w-6 h-6 text-primary-500" />
            Explore Map
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-transparent rounded-2xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all font-medium placeholder:font-normal"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Nearby Attractions</h3>
          
          <AnimatePresence>
            {MOCK_LOCATIONS.map((loc, i) => (
              <motion.div 
                key={loc.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedLocation(loc);
                  if (window.innerWidth < 768) setIsMobileSheetOpen(true);
                }}
                className={`group p-3 rounded-2xl cursor-pointer transition-all border ${
                  selectedLocation?.id === loc.id 
                    ? 'bg-primary-50 border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/20' 
                    : 'bg-white border-transparent hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800'
                } flex items-center gap-4`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                  <ProgressiveImage src={loc.image} aspectRatio="aspect-square" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{loc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">{loc.category}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                      {loc.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 h-2/3 md:h-full relative z-0">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Compass className="w-12 h-12 text-primary-200 dark:text-primary-900 mb-4" />
            </motion.div>
            <p className="text-slate-500 font-medium animate-pulse">Loading premium map engine...</p>
          </div>
        ) : (
          <MapContainer 
            center={[48.8566, 2.3522]} 
            zoom={13} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            
            {MOCK_LOCATIONS.map(loc => (
              <Marker 
                key={loc.id} 
                position={loc.pos}
                eventHandlers={{
                  click: () => {
                    setSelectedLocation(loc);
                    if (window.innerWidth < 768) {
                      setIsMobileSheetOpen(true);
                    }
                  }
                }}
              >
                {/* Only show desktop popup if not on mobile */}
                {window.innerWidth >= 768 && (
                  <Popup className="custom-popup" closeButton={false}>
                    <div className="w-48 overflow-hidden rounded-2xl shadow-xl bg-white border-0 p-0 m-0">
                      <div className="h-24 w-full relative">
                        <ProgressiveImage src={loc.image} aspectRatio="aspect-none h-full w-full" />
                      </div>
                      <div className="p-3 bg-white">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{loc.name}</h3>
                        <p className="text-xs text-slate-500 mb-3">{loc.category}</p>
                        <button className="w-full text-xs font-bold text-white bg-primary-500 py-2 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-primary-500/20">
                          <Navigation className="w-3 h-3" /> Directions
                        </button>
                      </div>
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </MapContainer>
        )}

        <div className="absolute top-6 left-6 z-[400] md:hidden">
          <div className="glass-premium rounded-full px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-2">
             <MapPin className="w-4 h-4 text-primary-500" />
             Interactive Map
          </div>
        </div>
      </div>

      <BottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        className="md:hidden"
      >
        {selectedLocation && (
          <div className="flex flex-col gap-4 pb-4">
            <div className="w-full h-48 relative rounded-2xl overflow-hidden shrink-0">
               <ProgressiveImage src={selectedLocation.image} aspectRatio="aspect-none h-full w-full" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedLocation.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-500 font-medium">{selectedLocation.category}</span>
                <span className="text-sm text-slate-300">•</span>
                <span className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                  {selectedLocation.rating}
                </span>
              </div>
              <button className="w-full text-sm font-bold text-white bg-primary-500 py-3.5 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25">
                <Navigation className="w-4 h-4" /> Get Directions
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
