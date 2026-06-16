import { JourneyLoading } from '@/components/common/JourneyLoading';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function JourneyStepper({ steps, activeNode, doneNodes, stageLabel }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--color-paper)] p-8 min-h-[60vh] w-full relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl glass-panel rounded-[2rem] p-10 md:p-16 border border-white/20 relative z-10"
      >
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-primary-900 tracking-tight mb-4">Curating Your Journey</h2>
          <p className="text-primary-600 font-medium text-lg">Our AI architects are designing your perfect itinerary</p>
        </div>
        
        <JourneyLoading steps={steps} activeNode={activeNode} doneNodes={doneNodes} />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s, index) => {
            const isDone = doneNodes.includes(s.key);
            const isActive = s.key === activeNode;
            
            let borderClass = 'border-primary-900/5 bg-surface-50 text-primary-400';
            let bgClass = 'bg-surface-200 text-primary-400';
            let iconContent = index + 1;
            
            if (isDone) {
              borderClass = 'border-accent-500/20 bg-accent-50 text-accent-700';
              bgClass = 'bg-accent-500 text-white shadow-lg shadow-accent-500/30';
              iconContent = <Check className="w-4 h-4" />;
            } else if (isActive) {
              borderClass = 'border-primary-600 bg-white shadow-luxury text-primary-900';
              bgClass = 'bg-primary-600 text-white animate-pulse shadow-lg shadow-primary-600/30';
            }
            
            return (
              <div key={s.key} className={`flex items-center p-6 rounded-2xl border transition-all duration-500 ${borderClass}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full mr-5 font-bold text-sm transition-all duration-500 ${bgClass}`}>
                  {iconContent}
                </span>
                <div>
                  <div className={`font-bold text-base tracking-wide ${isActive ? 'text-primary-900' : ''}`}>{s.label}</div>
                  <div className="text-sm font-medium opacity-70 mt-1">{isActive && stageLabel ? stageLabel : s.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
