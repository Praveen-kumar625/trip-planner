import { motion } from 'framer-motion';

export function DayTabs({ days, activeDay, setActiveDay }) {
  if (!days || days.length === 0) return null;
  
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pt-2" role="tablist" aria-label="Trip days">
      {days.map((d, i) => {
        const isActive = activeDay === i;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-controls={`day-panel-${i}`}
            id={`day-tab-${i}`}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-28 rounded-[1.5rem] border transition-all duration-500 font-bold relative overflow-hidden ${
              isActive 
                ? 'border-primary-600 bg-primary-600 text-white shadow-luxury transform -translate-y-2' 
                : 'border-primary-900/10 bg-white text-primary-900/60 hover:border-primary-300 hover:text-primary-900 hover:shadow-luxury'
            }`}
            onClick={() => setActiveDay(i)}
            aria-label={`${d.day_label || `Day ${i + 1}`}, ${d.date_str}`}
          >
            {isActive && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-primary-700 to-primary-500 z-0"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <span className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${isActive ? 'text-primary-200' : ''}`} aria-hidden="true">{d.day_label || `Day ${i + 1}`}</span>
              <span className={`text-2xl font-black ${isActive ? 'text-white' : ''}`} aria-hidden="true">{d.date_str}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
