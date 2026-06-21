import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Sparkles, Diamond, Eye, ArrowUpRight, Sliders, Target, Star, Key } from 'lucide-react';

export function TripWealthDashboard({ tripSummary, budget }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [activeStrategy, setActiveStrategy] = useState(null);

  const handleStrategyClick = (id) => {
    setActiveStrategy(id);
    setTimeout(() => setActiveStrategy(null), 2000);
  };

  // Derived Values
  const parsedBudget = budget ? parseInt(budget.toString().replace(/,/g, ''), 10) : 75000;
  
  // What If Engine logic
  const adjustedBudget = parsedBudget + (sliderValue * 10000); // Slider goes from -5 to +20

  // Dream Scale Calculation
  const dreamLevels = [
    { name: "Explorer", min: 0 },
    { name: "Discoverer", min: 40000 },
    { name: "Adventurer", min: 80000 },
    { name: "Story Collector", min: 120000 },
    { name: "Memory Creator", min: 200000 },
    { name: "Luxury Traveler", min: 350000 },
    { name: "Elite Explorer", min: 500000 },
    { name: "Legendary Wanderer", min: 1000000 }
  ];

  const currentLevelIndex = dreamLevels.findLastIndex(level => adjustedBudget >= level.min) || 0;
  const currentLevel = dreamLevels[currentLevelIndex].name;
  
  // Determine experiences unlocked based on budget
  const experiencesUnlocked = Math.floor(adjustedBudget / 15000) + 4;

  // Trip Quality Index (TQI)
  const calculateQuality = (base, scale) => Math.min(100, base + (sliderValue * scale));
  const tqi = {
    comfort: calculateQuality(80, 2),
    adventure: calculateQuality(75, 1),
    luxury: calculateQuality(60, 3),
    convenience: calculateQuality(85, 1.5),
    gastronomy: calculateQuality(70, 2.5),
    uniqueness: calculateQuality(90, 0.5)
  };

  const getMood = () => {
    if (adjustedBudget > 300000) return "Status: Luxury Ready";
    if (adjustedBudget > 150000) return "Status: Highly Optimized";
    if (adjustedBudget > 80000) return "Status: Experience Rich";
    return "Status: Confident & Ready";
  };

  return (
    <div className="mt-32 mb-20 relative selection:bg-primary-500 selection:text-white">
      {/* 1. Possibility Header */}
      <div className="text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-xl shadow-amber-500/10 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          {getMood()}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight max-w-5xl mx-auto"
        >
          Your Journey Capital unlocks <span className="text-amber-500 bg-amber-500/10 px-4 py-1 rounded-[2rem] whitespace-nowrap border border-amber-500/20">{experiencesUnlocked} unforgettable experiences.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Dream Scale & What If Engine */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Dream Scale */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-dark rounded-[2.5rem] p-8 md:p-10 border border-white/10 text-white shadow-premium relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">The Dream Scale™</span>
                  <h3 className="text-3xl font-serif font-bold text-amber-400">{currentLevel}</h3>
                </div>
                <Diamond className="w-8 h-8 text-white/20" />
              </div>

              {/* Scale Visualization */}
              <div className="space-y-4 mb-12 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                {dreamLevels.map((level, idx) => {
                  const isActive = idx === currentLevelIndex;
                  const isPassed = idx < currentLevelIndex;
                  return (
                    <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-105 origin-left' : isPassed ? 'opacity-40' : 'opacity-20'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500 ${isActive ? 'bg-amber-400 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : isPassed ? 'bg-white/50 border-transparent' : 'bg-transparent border-white/30'}`} />
                      <span className={`font-serif text-lg transition-colors duration-500 ${isActive ? 'text-white font-bold' : 'text-white/70'}`}>{level.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* What If Engine */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">What If Engine™</span>
                </div>
                
                <p className="text-sm text-white/60 mb-6 font-medium">Explore how adjusting your Journey Capital transforms your experience possibilities.</p>
                
                <input 
                  type="range" 
                  min="-5" 
                  max="20" 
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Optimize</span>
                  <div className="flex items-center gap-1 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                    <IndianRupee className="w-4 h-4 text-amber-400" />
                    <span className="text-xl font-bold tracking-tight text-white">{adjustedBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Expand</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: TQI, Future Memories, Secret Opportunities */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* TQI & Future Memory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Trip Quality Index */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-[2.5rem] p-8 border border-white/10 shadow-premium"
            >
              <div className="flex items-center gap-2 mb-8">
                <Target className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Trip Quality Index™</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Comfort", value: tqi.comfort, color: "bg-blue-500" },
                  { label: "Adventure", value: tqi.adventure, color: "bg-emerald-500" },
                  { label: "Luxury", value: tqi.luxury, color: "bg-amber-500" },
                  { label: "Gastronomy", value: tqi.gastronomy, color: "bg-rose-500" },
                  { label: "Uniqueness", value: tqi.uniqueness, color: "bg-purple-500" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2 font-bold tracking-wide">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="text-white">{Math.round(stat.value)}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_currentColor]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Future Memory Projection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-[2.5rem] p-8 border border-white/10 shadow-premium flex flex-col"
            >
              <div className="flex items-center gap-2 mb-8">
                <Eye className="w-5 h-5 text-rose-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Future Memory Value</span>
              </div>
              <h4 className="text-2xl font-serif font-bold text-white leading-snug mb-8">
                What your capital creates:
              </h4>
              <ul className="space-y-5 flex-grow">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-white/80 leading-relaxed">A private sunset experience overlooking the city.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-white/80 leading-relaxed">Unrestricted access to premium local gastronomy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-white/80 leading-relaxed">Seamless, stress-free transfers throughout the journey.</span>
                </li>
                {sliderValue > 5 && (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 shadow-inner"
                  >
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-amber-300 leading-relaxed">Five-star luxury accommodation unlocked.</span>
                  </motion.li>
                )}
                {sliderValue > 12 && (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 shadow-inner"
                  >
                    <Diamond className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span className="text-sm font-bold text-indigo-300 leading-relaxed">Exclusive helicopter transit between locations.</span>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          </div>

          {/* Secret Opportunities Layer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-amber-900/10 rounded-[2.5rem] p-8 md:p-10 border border-amber-900/30 shadow-premium relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Secret Opportunities Layer™</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-800/50 text-amber-300 px-4 py-2 rounded-full border border-amber-700/50 shadow-inner">
                  AI Concierge Found Value
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => handleStrategyClick('thursday')}
                  className="glass-dark p-6 rounded-2xl border border-amber-800/30 group cursor-pointer hover:bg-white/5 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  <h4 className="font-serif font-bold text-xl text-white mb-3">The Thursday Shift</h4>
                  <p className="text-sm font-medium text-white/60 mb-6 leading-relaxed">
                    Shifting your arrival by 1 day to Thursday upgrades your accommodation to Five-Star without increasing capital.
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                    {activeStrategy === 'thursday' ? 'Strategy Applied ✓' : (
                      <>Apply Strategy <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </span>
                </div>

                <div 
                  onClick={() => handleStrategyClick('aviation')}
                  className="glass-dark p-6 rounded-2xl border border-amber-800/30 group cursor-pointer hover:bg-white/5 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  <h4 className="font-serif font-bold text-xl text-white mb-3">Private Aviation</h4>
                  <p className="text-sm font-medium text-white/60 mb-6 leading-relaxed">
                    A short-hop private flight is currently pricing identically to commercial business class for your selected route.
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                    {activeStrategy === 'aviation' ? 'Exploring Options...' : (
                      <>Explore Option <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
