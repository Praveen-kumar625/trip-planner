import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, getAuth } from '@/services/api';
import { JourneyStepper } from './JourneyStepper';
import { useTripPlanner, JOURNEY_STEPS } from '@/hooks/useTripPlanner';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Sparkles, MapPin, Navigation } from 'lucide-react';

export function PlanPage({ onRequestLogin, currentUsername, onPhaseChange, onPlanReady, modifyTrigger, onManageProfile }) {
  const { t } = useTranslation();
  const {
    phase, query, setQuery, activeNode, doneNodes, stageLabel, missingFields,
    concernModal, errMsg, doStream, startPlan, confirmConcern
  } = useTripPlanner({ onPhaseChange, onPlanReady, currentUsername });

  const [profile, setProfile] = useState(null);
  const concernRef = useFocusTrap(!!concernModal);

  useEffect(() => {
    if (!getAuth()) { setProfile(null); return; }
    getProfile().then(setProfile).catch(() => {});
  }, [currentUsername]);

  useEffect(() => {
    if (modifyTrigger) {
      doStream({ query: modifyTrigger.query, plan_id: modifyTrigger.planId, modification_notes: modifyTrigger.query });
    }
  }, [modifyTrigger, doStream]);

  const handleStartPlan = () => {
    if (!getAuth()) { onRequestLogin && onRequestLogin(); return; }
    startPlan();
  };

  const examples = [
    "A 3-day romantic weekend to Kyoto, mostly quiet temples and omakase.",
    "A fast-paced 5-day food and culture tour of Delhi and Agra.",
    "A relaxing 7-day wellness retreat in Bali, avoiding tourist traps.",
  ];

  const profileRows = profile ? [
    { key: "attr", label: "Attractions", items: profile.attraction_prefs || [] },
    { key: "food", label: "Dining", items: profile.food_prefs || [] },
    { key: "habit", label: "Pace", items: profile.habit_prefs || [] },
  ].filter(r => r.items.length) : [];

  if (phase === "loading") {
    return (
      <main id="main-content" className="min-h-screen bg-primary-950 text-primary-50">
        <JourneyStepper steps={JOURNEY_STEPS} activeNode={activeNode} doneNodes={doneNodes} stageLabel={stageLabel} />
      </main>
    );
  }

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12 bg-primary-950 text-primary-50 relative overflow-hidden font-sans">
      
      <motion.div 
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-800 text-xs font-bold text-accent-400 uppercase tracking-widest mb-8 border-2 border-primary-700"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Travel Architect</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Where to <span className="text-brand-gradient">next?</span>
          </h1>
        </div>

        {profileRows.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 card-solid"
          >
            <div className="flex justify-between items-center mb-6 border-b-2 border-primary-800 pb-4">
              <h3 className="font-bold text-lg text-white tracking-wide uppercase">Your Travel Profile</h3>
              <button 
                className="text-sm font-bold text-primary-400 hover:text-accent-500 transition-colors" 
                onClick={onManageProfile}
              >
                Refine Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileRows.map(r => (
                <div key={r.key}>
                  <span className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-3">{r.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {r.items.map((it, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-primary-800 text-white text-xs font-bold border-2 border-primary-700">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-solid p-0 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <label htmlFor="trip-query" className="flex items-center gap-3 text-xl font-black text-white mb-6">
              <Navigation className="w-6 h-6 text-accent-500" />
              <span>Describe your ideal journey</span>
            </label>
            <textarea
              id="trip-query"
              className="w-full h-48 rounded-2xl bg-primary-800 border-2 border-primary-700 px-6 py-5 text-lg font-bold text-white placeholder:text-primary-500 focus:bg-primary-900 focus:border-accent-500 transition-all outline-none resize-none"
              placeholder="e.g. A 5-day luxury escape to the hills of Munnar with a focus on private tea estate tours and authentic Kerala cuisine."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleStartPlan(); }}
            />
            
            <AnimatePresence>
              {missingFields.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 flex gap-2 flex-wrap"
                >
                  {missingFields.map(f => (
                    <span key={f} className="px-4 py-1.5 bg-second-600 text-white border-2 border-second-500 rounded-xl text-xs font-bold">
                      Please specify: {f}
                    </span>
                  ))}
                </motion.div>
              )}
              
              {errMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-white text-sm font-bold bg-red-600 px-6 py-4 rounded-xl border-2 border-red-500"
                >
                  {errMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-primary-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border-t-2 border-primary-700 gap-6">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-400 w-full mb-2 block">Inspirations</span>
              {examples.map((ex) => (
                <button 
                  key={ex} 
                  className="px-4 py-2 bg-primary-900 rounded-xl text-xs font-bold text-primary-200 border-2 border-primary-700 hover:border-accent-500 hover:text-white transition-colors text-left" 
                  onClick={() => setQuery(ex)}
                >
                  {ex.slice(0, 35)}...
                </button>
              ))}
            </div>
            <button 
              className="btn-primary whitespace-nowrap w-full md:w-auto"
              onClick={handleStartPlan} 
              disabled={!query.trim()}
            >
              Curate Itinerary
            </button>
          </div>
        </motion.section>
      </motion.div>
      
      <AnimatePresence>
        {concernModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              ref={concernRef}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-primary-900 rounded-[2rem] max-w-lg w-full p-10 shadow-solid border-2 border-primary-800"
            >
              <h3 className="text-2xl font-black mb-4 text-white tracking-tight">Review Adjustment</h3>
              <p className="text-primary-200 font-bold mb-10 leading-relaxed">{concernModal.concern}</p>
              <div className="flex justify-end gap-4">
                <button 
                  className="px-6 py-3 font-bold text-primary-400 hover:text-white transition-colors" 
                  onClick={() => {}}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary px-8 py-3" 
                  onClick={confirmConcern}
                >
                  Confirm & Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
