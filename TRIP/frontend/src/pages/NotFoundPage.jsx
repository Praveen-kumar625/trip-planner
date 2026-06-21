import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080D17] flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#080D17] rounded-full blur-[100px] pointer-events-none" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-20" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-dark p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(255,184,0,0.1)] text-center max-w-lg w-full mx-4 relative z-10 backdrop-blur-2xl"
      >
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,184,0,0.3)] border-4 border-[#080D17]">
           <Compass className="w-12 h-12 text-[#080D17]" />
        </div>

        <h1 className="text-7xl md:text-8xl font-display font-light text-white mb-4 tracking-wider">404</h1>
        
        <div className="bg-primary-500/10 text-primary-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-primary-500/30 inline-block mb-8 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
          Off the Map
        </div>
        
        <p className="text-base font-serif italic text-white/50 mb-10 leading-relaxed max-w-sm mx-auto">
          The destination you're looking for seems to have vanished into the ether. Let's redirect your journey.
        </p>
        
        <Link 
          to="/" 
          className="glass-premium px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wider uppercase inline-block w-full transition-all hover:bg-white/10 hover:-translate-y-1 border border-white/20 shadow-premium"
        >
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
