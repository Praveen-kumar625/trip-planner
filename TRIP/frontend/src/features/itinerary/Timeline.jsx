import { motion } from 'framer-motion';
import { MapPin, Clock, Camera } from 'lucide-react';

export function Timeline({ day, index }) {
  if (!day || !day.items) return null;

  return (
    <div className="relative pl-8 pb-12 border-l-2 border-(--md-sys-color-primary)/20 ml-6">
      {/* Day Bubble */}
      <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-(--md-sys-color-primary) text-white flex items-center justify-center font-black shadow-lg">
        {index + 1}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-black text-(--md-sys-color-primary) font-serif">{day.date}</h3>
        <p className="text-sm font-bold text-(--md-sys-color-accent) uppercase tracking-widest">{day.theme}</p>
      </div>

      <div className="space-y-8">
        {day.items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-(--md-sys-color-surface) rounded-3xl p-6 shadow-md border border-black/5 dark:border-white/5 hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            {/* Story Indicator */}
            <div className="absolute left-0 top-0 w-1.5 h-full bg-(--md-sys-color-secondary)" />
            
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-50">{item.name}</h4>
              <div className="flex items-center gap-1 text-xs font-bold text-surface-500 bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" /> {item.duration || '2 hrs'}
              </div>
            </div>
            
            <p className="text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
              {item.desc || item.tip}
            </p>

            {item.cover && (
              <div className="w-full h-48 rounded-2xl overflow-hidden mt-4">
                <img src={item.cover} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="mt-4 flex gap-2">
              {item.type && (
                <span className="text-xs font-bold px-3 py-1 bg-(--md-sys-color-primary)/10 text-(--md-sys-color-primary) rounded-full">
                  {item.type}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
