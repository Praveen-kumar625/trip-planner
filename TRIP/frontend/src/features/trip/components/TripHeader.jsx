import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function TripHeader({ plan }) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'hinglish' : 'en';
    i18n.changeLanguage(nextLng);
  };

  if (!plan) return null;
  
  return (
    <header className="relative w-full h-[40vh] md:h-[50vh]" aria-label="Trip header">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-105" style={{ backgroundImage: `url('${plan.cover_img}')` }} role="img" aria-label={`Cover image of ${plan.title}`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" aria-hidden="true"></div>
      
      {/* Language Switcher Overlay */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleLanguage}
          className="glass-panel text-white font-semibold py-2 px-6 rounded-full text-xs hover:bg-white/20 transition-all shadow-luxury border-white/20 uppercase tracking-widest"
          aria-label={`Switch to ${i18n.language === 'en' ? 'Hinglish' : 'English'}`}
        >
          {i18n.language === 'en' ? 'EN / HI' : 'HI / EN'}
        </button>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 p-10 md:p-16 text-white w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-90 mb-4 block text-accent-400">Curated Journey</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-md mb-6">{plan.title}</h1>
        <div className="flex flex-wrap items-center gap-4" aria-label="Trip details">
          <span className="glass-panel border-white/10 px-6 py-2 rounded-full text-sm font-semibold tracking-wide shadow-luxury" aria-label={`Dates: ${plan.date_range}`}>{plan.date_range}</span>
          {plan.badges?.map(b => (
            <span key={b} className="bg-primary-600/80 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-sm font-semibold shadow-luxury">{b}</span>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
