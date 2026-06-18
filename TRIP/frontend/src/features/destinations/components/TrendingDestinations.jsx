import { useEffect, useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { destinationsService } from '../../../services/api';

export const TrendingDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsService.getTrending();
        setDestinations(response.data || []);
      } catch (error) {
        console.error('Failed to load trending destinations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
          <Compass className="w-6 h-6 mr-2 text-amber-500" />
          Trending Discoveries
        </h2>
        <button className="text-amber-600 dark:text-amber-400 font-medium hover:underline text-sm">
          Explore All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest) => (
          <div 
            key={dest.id}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
          >
            <img 
              src={dest.imageUrl || '/images/main_img_placeholder.jpg'} 
              alt={dest.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                <MapPin className="w-3 h-3 mr-1" />
                {dest.country}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {dest.name}
              </h3>
              <p className="text-sm text-white/70 mt-2 line-clamp-2">
                {dest.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
