import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Navigation, CheckCircle, X } from 'lucide-react';

/**
 * DestinationCard — Premium confirmation card shown after selecting a destination.
 *
 * Displays city, country, coordinates, and a "Ready for AI Planning" badge.
 * Supports an optional onClear callback to deselect.
 *
 * Props:
 *  - location: The resolved location data object.
 *  - onClear: Optional callback to clear the selection.
 *  - className: Optional additional classes.
 */
export function DestinationCard({ location, onClear, className = '' }) {
  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative bg-white/80 backdrop-blur-xl border border-emerald-200/60 rounded-2xl p-5 shadow-lg shadow-emerald-500/5 ${className}`}
    >
      {/* Clear button */}
      {onClear && (
        <button
          onClick={onClear}
          type="button"
          aria-label="Clear destination"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {location.image ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 shrink-0 border border-neutral-100">
            <img src={location.image} alt={location.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral-900 truncate">
            {location.city || location.name}
          </h3>
          <p className="text-sm text-neutral-500 font-medium truncate">
            {[location.state, location.country].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <DetailChip
          icon={<Navigation className="w-3.5 h-3.5" />}
          label="Latitude"
          value={location.latitude?.toFixed(4)}
        />
        <DetailChip
          icon={<Navigation className="w-3.5 h-3.5 rotate-90" />}
          label="Longitude"
          value={location.longitude?.toFixed(4)}
        />
        <DetailChip
          icon={<Globe className="w-3.5 h-3.5" />}
          label="Country"
          value={location.country}
          span={2}
        />
      </div>

      {/* AI Ready Badge */}
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-xs font-semibold text-emerald-700">
          Ready for AI Planning
        </span>
      </div>
    </motion.div>
  );
}

function DetailChip({ icon, label, value, span = 1 }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl ${
        span === 2 ? 'col-span-2' : ''
      }`}
    >
      <span className="text-neutral-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-neutral-700 truncate">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}
