import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Navigation2 } from 'lucide-react';

export function RouteMap({ route }) {
  return (
    <div className="w-full h-64 md:h-80 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 relative overflow-hidden group">
      {/* Abstract Map Background Grid */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      
      {/* Route Line SVG */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
        <motion.path
          d="M 50,150 Q 150,180 200,100 T 350,50"
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Markers */}
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        className="absolute left-[12%] bottom-[20%] flex flex-col items-center"
      >
        <div className="bg-blue-500/20 p-2 rounded-full mb-2 border border-blue-500/30">
          <Navigation className="w-5 h-5 text-blue-400 transform -rotate-45" />
        </div>
        <span className="text-xs font-medium text-blue-300 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm whitespace-nowrap">
          {route.currentLocation}
        </span>
      </motion.div>

      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: 'spring' }}
        className="absolute right-[10%] top-[20%] flex flex-col items-center"
      >
        <div className="bg-amber-500/20 p-2 rounded-full mb-2 border border-amber-500/30 shadow-glow-saffron">
          <MapPin className="w-6 h-6 text-amber-400" />
        </div>
        <span className="text-sm font-bold text-amber-400 bg-black/80 px-3 py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap shadow-xl">
          {route.destination}
        </span>
      </motion.div>

      {/* Moving Car Dot */}
      <motion.div
        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-blue-500 z-10"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          offsetPath: "path('M 50,150 Q 150,180 200,100 T 350,50')",
          offsetRotate: "auto"
        }}
      >
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50" />
      </motion.div>

      {/* Map UI Overlay */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/80 flex items-center gap-2">
          <Navigation2 className="w-3 h-3 text-emerald-400" />
          Live Demo Tracking
        </div>
      </div>
    </div>
  );
}
