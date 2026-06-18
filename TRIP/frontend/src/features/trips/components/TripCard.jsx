import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const TripCard = ({ trip, onClick }) => {
  const startDate = new Date(trip.startDate).toLocaleDateString();
  const endDate = new Date(trip.endDate).toLocaleDateString();

  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-slate-100 dark:border-slate-700 transition-all"
      onClick={() => onClick(trip.id)}
    >
      <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
        {trip.coverImage ? (
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200">
          {trip.status || 'Planned'}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{trip.title}</h3>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{trip.destinations?.map(d => d.name).join(', ') || 'Various Destinations'}</span>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{startDate} - {endDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{trip.travelers?.length || 1} Travelers</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
