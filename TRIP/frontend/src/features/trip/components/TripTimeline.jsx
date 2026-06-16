import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Star, Navigation } from 'lucide-react';

function photoUrl(seed, w = 640, h = 440) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function Thumb({ photo, seed, alt }) {
  const [err, setErr] = useState(false);
  const src = photo || (seed ? photoUrl(seed, 360, 280) : null);
  if (!src || err) return <div className="flex items-center justify-center bg-surface-100 text-surface-400 rounded-2xl w-28 h-28 flex-shrink-0" aria-label={alt}>◌</div>;
  return (
    <div className="w-28 h-28 rounded-2xl bg-cover bg-center flex-shrink-0 shadow-sm" style={{ backgroundImage: `url('${src}')` }} aria-label={alt} role="img">
      <img src={src} alt="" style={{ display: "none" }} onError={() => setErr(true)} />
    </div>
  );
}

const PERIOD = {
  morning:   { label: "Morning", cls: "bg-surface-100 text-primary-600 border-primary-100" },
  afternoon: { label: "Afternoon", cls: "bg-accent-50 text-accent-700 border-accent-100" },
  evening:   { label: "Evening", cls: "bg-primary-900 text-primary-100 border-primary-800" },
};

export function AttractionCard({ item, onNearby }) {
  const p = PERIOD[item.period] || PERIOD.morning;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 min-w-0 pl-6 pb-10 relative group"
    >
      <article className="bg-white border border-primary-900/5 rounded-3xl p-5 shadow-luxury transition-all duration-300 hover:shadow-luxury-hover hover:-translate-y-1 flex flex-col sm:flex-row gap-5">
        <Thumb photo={item.photo} seed={item.seed} alt={item.name} />
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-bold text-xl text-primary-900 truncate tracking-tight">{item.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${p.cls}`}>{p.label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-600/70 mb-3">
            {item.start && <span className="font-semibold flex items-center gap-1.5 text-primary-900"><Clock className="w-4 h-4 text-primary-400" /> {item.start}{item.end ? ` – ${item.end}` : ""}</span>}
            {item.rating != null && <span className="flex items-center text-accent-500 font-bold gap-1" aria-label={`Rating ${Number(item.rating).toFixed(1)} stars`}><Star className="w-4 h-4 fill-accent-500" /> {Number(item.rating).toFixed(1)}</span>}
            {item.cost && <span className="font-semibold" aria-label={`Cost per person ₹${item.cost}`}>₹{item.cost}/person</span>}
          </div>
          {item.address && <div className="text-sm text-primary-600/60 truncate mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.address}</div>}
          {item.note && <div className="mt-3 p-4 bg-surface-50 text-primary-700 rounded-2xl text-sm leading-relaxed border border-primary-900/5 font-medium" role="note">{item.note}</div>}
          {onNearby && item.location && (
            <button 
              className="mt-4 text-sm font-bold text-primary-600 hover:text-accent-500 self-start transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-50" 
              onClick={() => onNearby(item)}
            >
              <Navigation className="w-4 h-4" /> Explore Vicinity
            </button>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export function MealCard({ item }) {
  const label = item.type === "lunch" ? "Lunch" : "Dinner";
  if (item.no_restaurant) {
    return (
      <div className="flex-1 min-w-0 pl-6 pb-10 relative group">
        <div className="bg-surface-50 border border-primary-900/10 border-dashed rounded-3xl p-6" role="status">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">{label}</span>
            <span className="font-bold text-primary-900">Spontaneous Dining</span>
          </div>
          <p className="text-sm text-primary-600/70 font-medium">Explore the local area for culinary discoveries.</p>
        </div>
      </div>
    );
  }
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 min-w-0 pl-6 pb-10 relative group"
    >
      <article className="bg-white border border-accent-200 rounded-3xl p-5 shadow-luxury transition-all duration-300 hover:shadow-luxury-hover hover:-translate-y-1 flex flex-col sm:flex-row gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
        <Thumb photo={item.photo} seed={item.seed} alt={item.name} />
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-bold text-xl text-primary-900 truncate tracking-tight">{item.name}</h4>
            <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-bold uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-600/70 mb-3">
            {item.rating != null && <span className="flex items-center text-accent-500 font-bold gap-1"><Star className="w-4 h-4 fill-accent-500" /> {Number(item.rating).toFixed(1)}</span>}
            {item.cost && <span className="font-semibold">₹{item.cost} /person</span>}
            {item.category && <span className="bg-surface-100 text-primary-800 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase">{item.category}</span>}
          </div>
          {item.addr && <div className="text-sm text-primary-600/60 truncate mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.addr}</div>}
          {item.reason && <div className="mt-3 text-sm text-primary-700 bg-accent-50/50 p-4 rounded-2xl italic font-medium border border-accent-100/50">"{item.reason}"</div>}
        </div>
      </article>
    </motion.div>
  );
}

export function NavRow({ itemA, itemB, onNav, isActive }) {
  const hasCoords = itemA?.location?.lat && itemA?.location?.lng && itemB?.location?.lat && itemB?.location?.lng;
  if (!hasCoords) return null;
  const dist = itemB.dist;
  return (
    <div className="flex relative -mt-4 mb-4 group">
      <div className="w-16 flex-shrink-0 flex items-center justify-end pr-5 text-xs font-bold text-primary-400">
        {dist ? `${dist}km` : ""}
      </div>
      <div className="relative flex flex-col items-center">
        <div className="w-0.5 h-full bg-primary-900/10 absolute top-0 bottom-0"></div>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors duration-300 ${isActive ? 'border-primary-600 text-primary-600 shadow-md shadow-primary-600/20' : 'border-surface-200 text-surface-400 group-hover:border-primary-400 group-hover:text-primary-400'}`}>
          <Navigation className="w-3 h-3" />
        </div>
      </div>
      <div className="flex-1 pl-6 pt-1">
        <button
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-3 ${isActive ? "bg-primary-600 text-white shadow-luxury" : "bg-white text-primary-600 border border-primary-900/10 hover:border-primary-300 hover:shadow-sm"}`}
          onClick={() => onNav({ from: itemA.location, to: itemB.location })}
        >
          <span>Route Details</span>
          <span className="opacity-60 text-xs font-medium truncate max-w-[150px] sm:max-w-[200px] hidden sm:inline-block">({itemA.name} → {itemB.name})</span>
        </button>
      </div>
    </div>
  );
}

export function Timeline({ items, onNav, activeNavKey }) {
  return (
    <ul className="pt-6" aria-label="Trip timeline">
      {items.map((item, i) => {
        const isMeal = item.type !== "attraction";
        const prevItem = i > 0 ? items[i - 1] : null;
        const navKey = i > 0 ? String(i) : null;
        return (
          <li key={i}>
            {i > 0 && onNav && (
              <NavRow
                itemA={prevItem}
                itemB={item}
                onNav={(pair) => onNav(activeNavKey === navKey ? null : navKey, pair)}
                isActive={activeNavKey === navKey}
              />
            )}
            <div className="flex relative">
              <div className="w-16 flex-shrink-0 pt-7 pr-5 text-right">
                <span className="text-sm font-black text-primary-900 tracking-tight">{isMeal ? "" : (item.start || "")}</span>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-0.5 h-full bg-primary-900/10 absolute top-0 bottom-0"></div>
                <div className={`w-4 h-4 rounded-full border-4 bg-white z-10 mt-8 ${isMeal ? 'border-accent-500' : 'border-primary-600 shadow-[0_0_0_4px_rgba(26,42,64,0.1)]'}`}></div>
              </div>
              {isMeal
                ? <MealCard item={item} />
                : <AttractionCard item={item} onNearby={onNav ? (it) => onNav("nearby:" + i, null, it) : undefined} />
              }
            </div>
          </li>
        );
      })}
    </ul>
  );
}
