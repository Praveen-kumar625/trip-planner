import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cn } from '../ui/Button';

export function MagazineCard({ title, tag, label, image, className, onClick }) {
  return (
    <motion.div 
      className={cn(
        "group relative rounded-3xl overflow-hidden cursor-pointer aspect-[4/5] shadow-xl hover:shadow-2xl transition-all duration-500",
        "bg-(--md-sys-color-surface) border border-white/10",
        className
      )}
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Top Label */}
      <div className="absolute top-5 left-5">
        <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/20">
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="text-3xl font-black text-white mb-2 font-serif tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-(--md-sys-color-accent) font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
          <MapPin className="w-4 h-4" /> {tag}
        </p>
      </div>
    </motion.div>
  );
}
