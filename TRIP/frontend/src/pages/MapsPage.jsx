import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { MapPin, Navigation, Search, Map as MapIcon, Compass, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveImage } from '@/components/ui/Image';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { tripsService } from '@/services/api/trips.service';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Keep fallback mock locations if needed
const MOCK_LOCATIONS = [
  { id: 1, name: 'Eiffel Tower', category: 'Attraction', rating: 4.9, image: 'https://images.unsplash.com/photo-1543305113-82b46af139df?q=80&w=600&auto=format&fit=crop', pos: [48.8584, 2.2945] },
  { id: 2, name: 'Louvre Museum', category: 'Museum', rating: 4.8, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop', pos: [48.8606, 2.3376] },
  { id: 3, name: 'Notre-Dame', category: 'Historical', rating: 4.7, image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=600&auto=format&fit=crop', pos: [48.8529, 2.3500] },
];

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export function MapsPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  const { currentTrip, fetchTripById } = useTripStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [globalTrips, setGlobalTrips] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      setIsLoading(true);
      if (tripId) {
        await fetchTripById(tripId);
      } else if (user) {
        // Fetch all trips for global map
        try {
          const res = await tripsService.getAllTrips(user.uid);
          setGlobalTrips(res.data);
        } catch (e) {
          console.error("Failed to load global trips", e);
        }
      }
      setIsLoading(false);
    };
    initMap();
  }, [tripId, user, fetchTripById]);

  // Compute map locations dynamically
  const locations = useMemo(() => {
    if (tripId && currentTrip?.itinerary) {
      try {
        let parsed = typeof currentTrip.itinerary === 'string' ? JSON.parse(currentTrip.itinerary) : currentTrip.itinerary;
        let data = Array.isArray(parsed) ? parsed : parsed.smartRecommendations?.topAttractions || [];
        
        return data.filter(a => a.lat && a.lng).map((attraction, i) => ({
          id: `attr-${i}`,
          name: attraction.name || 'Attraction',
          category: attraction.category || 'Point of Interest',
          rating: 4.5 + Math.random() * 0.5,
          image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', // default fallback image
          pos: [attraction.lat, attraction.lng],
        }));
      } catch (e) {
        console.error("Error parsing itinerary for map", e);
      }
    } else if (!tripId && globalTrips.length > 0) {
      // Show one marker per trip destination
      return globalTrips.map(trip => {
        // We might not have exact lat/lng for city, so we fallback or extract if available
        // For demonstration, let's use a generic pos or parse if stored
        return {
          id: trip.id,
          name: trip.destination?.city || 'Trip',
          category: trip.destination?.country || 'Destination',
          rating: 5.0,
          image: trip.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600&auto=format&fit=crop',
          pos: [20 + Math.random()*20, 70 + Math.random()*20] // Very rough fallback if no coords are stored for the destination itself
        }
      });
    }
    return MOCK_LOCATIONS; // Fallback to mock if nothing is available
  }, [tripId, currentTrip, globalTrips]);

  const mapCenter = locations.length > 0 ? locations[0].pos : [48.8566, 2.3522];
  const mapZoom = tripId ? 12 : 3; // Closer zoom for specific trip, wide zoom for global

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#080D17] overflow-hidden relative z-0 selection:bg-primary-500 selection:text-white">
      
      <div className="w-full md:w-[450px] glass-dark border-r border-white/10 flex flex-col h-1/3 md:h-full z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0">
        <div className="p-6 md:p-8 border-b border-white/10 bg-black/20">
          <h2 className="text-3xl font-display font-light text-white flex items-center gap-3 mb-6 tracking-wide">
            <Compass className="w-8 h-8 text-primary-400" />
            {tripId ? 'Trip Map' : 'Global Map'}
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all font-serif placeholder:font-serif placeholder:italic placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 px-2">Nearby Attractions</h3>
          
          <AnimatePresence>
            {locations.map((loc, i) => (
              <motion.div 
                key={loc.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedLocation(loc);
                  if (window.innerWidth < 768) setIsMobileSheetOpen(true);
                }}
                className={`group p-4 rounded-3xl cursor-pointer transition-all border ${
                  selectedLocation?.id === loc.id 
                    ? 'glass-premium border-primary-500/30' 
                    : 'glass-dark border-white/5 hover:border-white/20'
                } flex items-center gap-5`}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative shadow-inner">
                  <ProgressiveImage src={loc.image} aspectRatio="aspect-square" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-lg text-white truncate tracking-wide">{loc.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-white/50 font-bold uppercase tracking-wider">{loc.category}</span>
                    <span className="text-xs text-white/20">•</span>
                    <span className="flex items-center text-xs font-bold text-white/70">
                      <Star className="w-3.5 h-3.5 text-primary-400 fill-primary-400 mr-1.5" />
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#080D17]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Compass className="w-16 h-16 text-primary-500/20 mb-6" />
            </motion.div>
            <p className="text-white/40 font-serif italic text-lg animate-pulse">Loading premium map engine...</p>
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <MapController center={mapCenter} />
            {/* Dark themed basemap for premium feel */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            
            {locations.map(loc => (
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
                  <Popup className="custom-popup-dark" closeButton={false}>
                    <div className="w-56 overflow-hidden rounded-3xl shadow-2xl glass-dark border border-white/10 p-0 m-0 backdrop-blur-xl">
                      <div className="h-32 w-full relative">
                        <ProgressiveImage src={loc.image} aspectRatio="aspect-none h-full w-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white">
                          <Star className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />
                          {loc.rating}
                        </div>
                      </div>
                      <div className="p-4 bg-transparent">
                        <h3 className="font-display text-base text-white truncate tracking-wide">{loc.name}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1 mb-4">{loc.category}</p>
                        <button className="w-full text-xs font-bold uppercase tracking-wider text-black bg-primary-400 py-3 rounded-xl hover:bg-primary-300 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,184,0,0.3)]">
                          <Navigation className="w-4 h-4" /> Directions
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
          <div className="glass-premium rounded-full px-5 py-2.5 text-sm font-bold tracking-wide shadow-[0_5px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5 text-white border border-white/10">
             <MapPin className="w-4 h-4 text-primary-400" />
             Interactive Map
          </div>
        </div>
      </div>

      <BottomSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        className="md:hidden glass-dark border-t border-white/10"
      >
        {selectedLocation && (
          <div className="flex flex-col gap-6 pb-6 pt-2">
            <div className="w-full h-56 relative rounded-3xl overflow-hidden shrink-0 shadow-inner">
               <ProgressiveImage src={selectedLocation.image} aspectRatio="aspect-none h-full w-full" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#080D17]/80 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-light text-white mb-2 tracking-wide">{selectedLocation.name}</h2>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">{selectedLocation.category}</span>
                <span className="text-xs text-white/20">•</span>
                <span className="flex items-center text-sm font-bold text-white">
                  <Star className="w-4 h-4 text-primary-400 fill-primary-400 mr-1.5" />
                  {selectedLocation.rating}
                </span>
              </div>
              <button className="w-full text-sm font-bold uppercase tracking-wider text-black bg-primary-400 py-4 rounded-2xl hover:bg-primary-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
                <Navigation className="w-5 h-5" /> Get Directions
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
