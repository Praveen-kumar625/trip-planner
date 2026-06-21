import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Wallet, Heart, ArrowRight, Check, Sparkles, MapPin } from 'lucide-react';
import { useTripGeneratorStore } from '@/hooks/useTripGenerator';
import { BudgetSelector } from '@/features/budget/components/BudgetSelector';

const TRAVELER_TYPES = [
  { id: 'solo', label: 'Solo', icon: '👤', count: 1 },
  { id: 'couple', label: 'Couple', icon: '💑', count: 2 },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', count: 4 },
  { id: 'friends', label: 'Friends', icon: '🎉', count: 4 },
];

const PREFERENCES = [
  { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🥂' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🏖️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

export function ProgressivePreferenceForm({ onComplete, onBack }) {
  const store = useTripGeneratorStore();
  const [currentSection, setCurrentSection] = useState('dates'); // dates, travelers, budget, preferences
  const today = new Date().toISOString().split('T')[0];

  const SECTIONS = [
    { id: 'dates', title: 'When are you going?', icon: Calendar, isComplete: store.startDate && store.endDate },
    { id: 'travelers', title: 'Who is traveling?', icon: Users, isComplete: store.travelerType },
    { id: 'budget', title: 'What is your budget?', icon: Wallet, isComplete: store.budget },
    { id: 'preferences', title: 'What are your vibes?', icon: Heart, isComplete: store.preferences.length > 0 },
  ];

  const handleGenerate = () => {
    const payload = store.generatePayload();
    const prompt = store.generatePrompt();
    onComplete?.(payload, prompt);
  };

  const getNextSection = (currentId) => {
    const idx = SECTIONS.findIndex((s) => s.id === currentId);
    if (idx < SECTIONS.length - 1) return SECTIONS[idx + 1].id;
    return null;
  };

  const advance = (currentId) => {
    const next = getNextSection(currentId);
    if (next) setCurrentSection(next);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <button 
            onClick={onBack}
            className="text-sm font-medium text-white/50 hover:text-white mb-2 transition-colors flex items-center gap-1"
          >
            ← Change destination
          </button>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-500" />
            {store.destination?.city || store.destination?.formattedAddress || 'Destination'}
          </h2>
        </div>
      </motion.div>

      <div className="space-y-6">
        {SECTIONS.map((section, index) => {
          const isActive = currentSection === section.id;
          const Icon = section.icon;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
                isActive 
                  ? 'bg-white/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20 backdrop-blur-xl' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-xl'
              }`}
            >
              {/* Header */}
              <div 
                onClick={() => setCurrentSection(section.id)}
                className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${
                  isActive ? 'bg-amber-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-amber-500/20 text-amber-400' : 
                    section.isComplete ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {section.isComplete && !isActive ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className={`text-xl font-bold ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {section.title}
                  </h3>
                </div>
                
                {!isActive && section.isComplete && (
                  <div className="text-sm font-medium text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                    Completed
                  </div>
                )}
              </div>

              {/* Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-white/10">
                      
                      {/* DATES */}
                      {section.id === 'dates' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-white/60 mb-2">Start Date</label>
                              <input
                                style={{colorScheme: 'dark'}}
                                type="date"
                                value={store.startDate}
                                min={today}
                                onChange={(e) => store.setDates(e.target.value, store.endDate)}
                                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-medium focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-white/60 mb-2">End Date</label>
                              <input
                                style={{colorScheme: 'dark'}}
                                type="date"
                                value={store.endDate}
                                min={store.startDate || today}
                                onChange={(e) => store.setDates(store.startDate, e.target.value)}
                                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-medium focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              disabled={!store.startDate || !store.endDate}
                              onClick={() => advance('dates')}
                              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
                            >
                              Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TRAVELERS */}
                      {section.id === 'travelers' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {TRAVELER_TYPES.map((type) => (
                              <button
                                key={type.id}
                                onClick={() => {
                                  store.setTravelerType(type.id);
                                  setTimeout(() => advance('travelers'), 400);
                                }}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                                  store.travelerType === type.id
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 scale-105'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                }`}
                              >
                                <span className="text-3xl mb-1">{type.icon}</span>
                                <span className="font-bold">{type.label}</span>
                              </button>
                            ))}
                          </div>
                          
                          {store.travelerType && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                              <span className="font-semibold text-white/80">Traveler count:</span>
                              <div className="flex items-center gap-4">
                                <button onClick={() => store.setTravelerCount(Math.max(1, store.travelerCount - 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-sm flex items-center justify-center font-bold text-xl">-</button>
                                <span className="text-2xl font-bold w-8 text-center text-white">{store.travelerCount}</span>
                                <button onClick={() => store.setTravelerCount(Math.min(20, store.travelerCount + 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-sm flex items-center justify-center font-bold text-xl">+</button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* BUDGET */}
                      {section.id === 'budget' && (
                        <div className="space-y-6">
                          <BudgetSelector onBudgetSelect={(b) => {
                            store.setBudget(b);
                            setTimeout(() => advance('budget'), 400);
                          }} value={store.budget} />
                        </div>
                      )}

                      {/* PREFERENCES */}
                      {section.id === 'preferences' && (
                        <div className="space-y-6">
                          <div className="flex flex-wrap gap-3">
                            {PREFERENCES.map((pref) => {
                              const isSelected = store.preferences.includes(pref.id);
                              return (
                                <button
                                  key={pref.id}
                                  onClick={() => store.togglePreference(pref.id)}
                                  className={`px-5 py-3 rounded-full font-semibold transition-all border ${
                                    isSelected
                                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                  }`}
                                >
                                  <span className="mr-2">{pref.emoji}</span>
                                  {pref.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: SECTIONS.every(s => s.isComplete) ? 1 : 0.5, y: 0 }}
        className="mt-12 flex justify-center"
      >
        <button
          onClick={handleGenerate}
          disabled={!SECTIONS.every(s => s.isComplete)}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl ${
            SECTIONS.every(s => s.isComplete)
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]'
              : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Generate Itinerary
        </button>
      </motion.div>
    </div>
  );
}
