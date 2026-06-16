import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timeline } from './TripTimeline';
import { MapPanel } from './MapPanel';
import { NearbySearchModal } from './NearbySearchModal';
import { TripHeader } from './TripHeader';
import { DayTabs } from './DayTabs';
import { TripNotes } from './TripNotes';
import { useTripEditing } from '@/hooks/useTripEditing';
import { savePlanMetadata } from '@/services/api';

export function TripDetailPage({ plan: planProp, planId: planIdProp, onRequestModify, onRequestLogin, currentUsername }) {
  const {
    plan, planId, 
    optimizingDay, optimizedDays, dayMsg,
    handleOptimize, handleRevert,
    editing, saving, saveErr,
    enterEdit, exitEdit, saveEdit, applyEdit, undo, redo,
    undoCount, redoCount,
    editedView, draft, searchTarget, setSearchTarget
  } = useTripEditing(planProp, planIdProp, currentUsername);

  const [dayIdx, setDayIdx] = useState(0);
  const [activeNavKey, setActiveNavKey] = useState(null);
  const [activeNavPair, setActiveNavPair] = useState(null);
  const [nearbyTarget, setNearbyTarget] = useState(null);
  const [themeInput, setThemeInput] = useState('');
  
  const [metaDirty, setMetaDirty] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);

  useEffect(() => {
    setDayIdx(0);
    setActiveNavKey(null);
    setActiveNavPair(null);
    setNearbyTarget(null);
  }, [planIdProp]);

  useEffect(() => {
    if (editing && draft) setThemeInput(draft[dayIdx]?.theme || '');
  }, [editing, dayIdx, draft]);

  const handleNav = (key, pair, nearbyItem) => {
    if (nearbyItem) {
      setNearbyTarget({ location: nearbyItem.location, name: nearbyItem.name, dayI: dayIdx, idx: Number(key.split(':')[1]) });
      return;
    }
    if (key === activeNavKey) {
      setActiveNavKey(null); setActiveNavPair(null);
    } else {
      setActiveNavKey(key); setActiveNavPair(pair);
    }
  };

  const handlePoiPick = (poi) => {
    const { dayI, idx, addType } = searchTarget;
    setSearchTarget(null);
    applyEdit(d => {
      const tl = d[dayI].timeline;
      if (idx != null) {
        const old = tl[idx];
        if (old.type === 'attraction') {
          tl[idx] = { ...old, name: poi.name, rating: poi.rating ?? null,
            open_time: poi.open_time ?? null, location: poi.location,
            photo: poi.photo ?? null, tip: null };
        } else {
          tl[idx] = { type: old.type, name: poi.name, rating: poi.rating ?? null,
            cost: poi.cost ?? null, address: poi.address ?? null,
            location: poi.location, photo: poi.photo ?? null,
            reason: null, no_restaurant: false };
        }
      } else if (addType === 'attraction') {
        tl.push({ type: 'attraction', name: poi.name, rating: poi.rating ?? null,
          open_time: poi.open_time ?? null, location: poi.location,
          photo: poi.photo ?? null, tip: null,
          start_time: null, end_time: null, period: 'afternoon' });
      } else {
        tl.push({ type: addType, name: poi.name, rating: poi.rating ?? null,
          cost: poi.cost ?? null, address: poi.address ?? null,
          location: poi.location, photo: poi.photo ?? null,
          reason: null, no_restaurant: false });
      }
    });
  };

  const handleUpdateField = (field, value) => {
    plan[field] = value;
    setMetaDirty(true);
  };

  const handleSaveMeta = async () => {
    if (!planId) return;
    setMetaSaving(true);
    try {
      await savePlanMetadata(planId, { hotel: plan.hotel_info, notes: plan.general_notes });
      setMetaDirty(false);
    } catch (e) { alert(e.message || 'Failed to save notes'); }
    finally { setMetaSaving(false); }
  };

  if (!plan) return null;
  const viewPlan = editing && editedView ? editedView : plan;
  const day = viewPlan.days[dayIdx];
  const dayNo = dayIdx + 1;
  const hasAttractions = (day.items || []).filter(it => it.type === 'attraction').length >= 2;
  const isOptimized = optimizedDays[dayIdx] !== undefined;

  return (
    <motion.div 
      className="flex min-h-[calc(100vh-80px)] flex-col bg-primary-950 text-primary-50 p-6 md:p-12 relative font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8 relative z-10">
        <motion.div 
          className="card-solid p-0 overflow-hidden border-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TripHeader plan={plan} />
        </motion.div>

        {/* View Switcher */}
        <div className="flex gap-4 border-b-2 border-primary-800 pb-2">
          {['itinerary', 'finance'].map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all ${activeView === v ? 'text-accent-50 text-accent-500 border-b-2 border-accent-500' : 'text-primary-400 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>

        {activeView === 'finance' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TravelFinanceDashboard planId={planId} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              className="lg:col-span-7 space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DayTabs days={viewPlan.days} activeDay={dayIdx} setActiveDay={(i) => { setDayIdx(i); setActiveNavKey(null); setActiveNavPair(null); }} />
        ...
            </motion.div>
          </div>
        )}
            <div className="card-solid p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b-2 border-primary-800">
                {editing ? (
                  <input
                    className="text-2xl font-black bg-primary-800 border-2 border-primary-700 rounded-xl px-4 py-3 focus:ring-0 transition-all outline-none w-full sm:w-2/3 focus:bg-primary-900 focus:border-accent-500 text-white"
                    value={themeInput}
                    onChange={e => setThemeInput(e.target.value)}
                    onBlur={() => {
                      const cur = draft[dayIdx]?.theme || '';
                      if (themeInput !== cur) applyEdit(d => { d[dayIdx].theme = themeInput; });
                    }}
                    onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                  />
                ) : (
                  <h3 className="text-3xl font-black text-white tracking-tight">{day.theme}</h3>
                )}
                
                <div className="flex gap-3">
                  {!editing && planId && (
                    <button 
                      className="btn-outline px-6 py-2 text-sm" 
                      onClick={enterEdit}
                    >
                      Curate Details
                    </button>
                  )}
                  {!editing && hasAttractions && planId && (
                    isOptimized ? (
                      <button 
                        className="btn-primary bg-primary-800 hover:bg-primary-700 px-6 py-2 text-sm" 
                        onClick={() => handleRevert(dayNo)}
                      >
                        Restore Route
                      </button>
                    ) : (
                      <button 
                        className="btn-primary px-6 py-2 text-sm" 
                        disabled={optimizingDay === dayNo} 
                        onClick={() => handleOptimize(dayNo)}
                      >
                        {optimizingDay === dayNo ? 'Optimizing...' : 'Smart Routing'}
                      </button>
                    )
                  )}
                </div>
              </div>

              <AnimatePresence>
                {dayMsg && dayMsg.day === dayNo && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-4 bg-primary-800 text-accent-400 border-2 border-primary-700 rounded-2xl text-sm font-bold flex items-center gap-3"
                  >
                    <div className="w-3 h-3 rounded-full bg-accent-500 animate-pulse" />
                    {dayMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6" role="tabpanel">
                <Timeline items={day.items || []} onNav={handleNav} activeNavKey={activeNavKey} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-[400px] lg:h-[500px] sticky top-32 rounded-3xl overflow-hidden shadow-solid border-4 border-primary-800 bg-primary-900 z-10">
              <MapPanel day={day} dayIdx={dayIdx} navPair={activeNavPair} onNavClear={() => { setActiveNavKey(null); setActiveNavPair(null); }} />
            </div>
            
            <div className="card-solid p-8">
              <TripNotes plan={plan} onUpdateField={handleUpdateField} />
            </div>
            
            <AnimatePresence>
              {metaDirty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <button 
                    className="btn-primary w-full py-4 text-base"
                    disabled={metaSaving} 
                    onClick={handleSaveMeta}
                  >
                    {metaSaving ? 'Syncing...' : 'Save Preferences'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {nearbyTarget && (
          <NearbySearchModal 
            location={nearbyTarget.location} 
            name={nearbyTarget.name} 
            onClose={() => setNearbyTarget(null)} 
            onPickMeal={(poi, type) => {
              setSearchTarget({ dayI: nearbyTarget.dayI, addType: type });
              handlePoiPick(poi);
              setNearbyTarget(null);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
