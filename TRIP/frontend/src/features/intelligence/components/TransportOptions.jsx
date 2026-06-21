import React from 'react';
import { motion } from 'framer-motion';
import { Car, Bike, Bus, Train, Plane, Navigation } from 'lucide-react';

const getIcon = (iconName) => {
  switch(iconName) {
    case 'Car': return <Car className="w-6 h-6" />;
    case 'Bike': return <Bike className="w-6 h-6" />;
    case 'Bus': return <Bus className="w-6 h-6" />;
    case 'Train': return <Train className="w-6 h-6" />;
    case 'Taxi': return <Car className="w-6 h-6" />;
    case 'Plane': return <Plane className="w-6 h-6" />;
    default: return <Navigation className="w-6 h-6" />;
  }
};

export function TransportOptions({ transports }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-semibold text-white flex items-center gap-2">
        Transport Modes
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {transports.map((transport, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:border-amber-500/50 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-xl text-white group-hover:bg-amber-500 group-hover:text-black transition-colors">
                {getIcon(transport.icon)}
              </div>
              <span className="text-xs font-medium text-white/50 bg-white/5 px-2 py-1 rounded-md">
                {transport.type}
              </span>
            </div>
            <h4 className="text-lg font-medium text-white mb-1">{transport.mode}</h4>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-white/60">{transport.duration}</span>
              <span className="font-bold text-amber-400">{transport.cost}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
