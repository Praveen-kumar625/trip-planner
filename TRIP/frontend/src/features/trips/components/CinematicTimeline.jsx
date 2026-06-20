import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, MapPin, Wind, Heart, Sparkles, Navigation } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProgressiveImage } from '@/components/ui/Image';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop'
];

// Helper to generate a poetic theme if none exists
const getChapterTheme = (idx, total) => {
  if (idx === 0) return "Arrival & The First Breath";
  if (idx === total - 1) return "Farewell & Golden Memories";
  const themes = [
    "Hidden Streets & Local Flavors",
    "Adventure Beyond The Tourist Trail",
    "Sunrise Above The Mountains",
    "Luxury & Deep Relaxation",
    "Culture, Art, and History"
  ];
  return themes[idx % themes.length];
};

const getEmotion = (idx) => {
  const emotions = [
    { label: "High Anticipation", icon: Wind, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Deep Wonder", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pure Adrenaline", icon: Navigation, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Romantic Bliss", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" }
  ];
  return emotions[idx % emotions.length];
};

export function CinematicTimeline({ itineraryData }) {
  if (!itineraryData || !Array.isArray(itineraryData)) {
    return (
      <div className="w-full h-64 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
        <p className="text-slate-500 font-serif italic text-xl">The pages of this chapter are still unwritten...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-32 pb-24">
      {itineraryData.map((dayPlan, idx) => {
        const theme = getChapterTheme(idx, itineraryData.length);
        const emotion = getEmotion(idx);

        return (
          <div key={idx} className="relative w-full">
            {/* Cinematic Day Header */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-500 dark:text-primary-400 mb-4 block">
                  Chapter 0{idx + 1}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-2xl">
                  {theme}
                </h2>
              </div>
              
              <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
                <div className={`w-12 h-12 rounded-full ${emotion.bg} flex items-center justify-center`}>
                  <emotion.icon className={`w-5 h-5 ${emotion.color}`} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Emotion</span>
                  <span className={`font-serif italic font-medium ${emotion.color}`}>{emotion.label}</span>
                </div>
              </div>
            </motion.div>

            {/* The Timeline Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              
              {/* Vertical Line for Desktop */}
              <div className="hidden md:block md:col-span-1 relative flex justify-center">
                <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800" />
              </div>

              <div className="md:col-span-11 space-y-24">
                {dayPlan.morning && (
                  <StoryMoment 
                    time="Morning Light" 
                    icon={Sun} 
                    content={dayPlan.morning} 
                    image={MOCK_IMAGES[(idx * 3) % MOCK_IMAGES.length]} 
                  />
                )}
                {dayPlan.afternoon && (
                  <StoryMoment 
                    time="High Sun" 
                    icon={Sun} 
                    content={dayPlan.afternoon} 
                    image={MOCK_IMAGES[(idx * 3 + 1) % MOCK_IMAGES.length]} 
                  />
                )}
                {dayPlan.evening && (
                  <StoryMoment 
                    time="Golden Hour & Beyond" 
                    icon={Sunset} 
                    content={dayPlan.evening} 
                    image={MOCK_IMAGES[(idx * 3 + 2) % MOCK_IMAGES.length]} 
                  />
                )}

                {/* Day Logistics Footer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-100 dark:border-slate-800/50">
                  {dayPlan.foodBreaks && <LogisticItem label="Dining Experience" value={dayPlan.foodBreaks} />}
                  {dayPlan.travelTime && <LogisticItem label="Journey Time" value={dayPlan.travelTime} />}
                  {dayPlan.restTime && <LogisticItem label="Pace & Rest" value={dayPlan.restTime} />}
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

function StoryMoment({ time, icon: Icon, content, image }) {
  const { id } = useParams();
  const [isReplacing, setIsReplacing] = useState(false);

  const handleReplace = () => {
    setIsReplacing(true);
    setTimeout(() => setIsReplacing(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="group relative flex flex-col xl:flex-row gap-8 xl:gap-16 items-center"
    >
      <div className="w-full xl:w-1/2 aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-premium bg-slate-100 dark:bg-slate-900">
        <ProgressiveImage 
          src={image} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
        
        {/* Memory Tag */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 shadow-2xl">
          <Icon className="w-4 h-4 text-amber-200" />
          {time}
        </div>
      </div>

      <div className="w-full xl:w-1/2 flex flex-col justify-center">
        <div className="w-12 h-px bg-primary-500 mb-8 hidden xl:block" />
        <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-serif mb-8">
          {content}
        </p>
        
        <div className="flex items-center gap-4">
          <Link 
            to={id ? `/maps?tripId=${id}` : `/maps`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
          >
            <MapPin className="w-4 h-4" /> 
            Explore Location
          </Link>
          <button 
            onClick={handleReplace}
            disabled={isReplacing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {isReplacing ? "Finding Alternatives..." : "Replace Experience"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LogisticItem({ label, value }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-300 leading-relaxed">{value}</span>
    </div>
  );
}
