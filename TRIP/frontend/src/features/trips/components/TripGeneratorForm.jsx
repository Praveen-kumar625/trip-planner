import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Wallet, Heart, CheckCircle, ArrowRight, ArrowLeft,
  Sparkles, User, UsersRound, Baby, PartyPopper,
  Mountain, Gem, TreePine, UtensilsCrossed, Landmark, Music, CarFront, Waves,
} from 'lucide-react';
import { useTripGeneratorStore } from '@/hooks/useTripGenerator';
import { DestinationSearch } from '@/components/destination';
import { BudgetSelector, formatINR } from '@/features/budget/components/BudgetSelector';

const STEP_META = [
  { num: 1, title: 'Destination', icon: MapPin },
  { num: 2, title: 'Dates', icon: Calendar },
  { num: 3, title: 'Travelers', icon: Users },
  { num: 4, title: 'Budget', icon: Wallet },
  { num: 5, title: 'Preferences', icon: Heart },
  { num: 6, title: 'Review', icon: CheckCircle },
];

const TRAVELER_TYPES = [
  { id: 'solo', label: 'Solo', icon: User, desc: 'Just me', count: 1 },
  { id: 'couple', label: 'Couple', icon: UsersRound, desc: 'Romantic getaway', count: 2 },
  { id: 'family', label: 'Family', icon: Baby, desc: 'Family adventure', count: 4 },
  { id: 'friends', label: 'Friends', icon: PartyPopper, desc: 'Group fun', count: 4 },
];

const PREFERENCES = [
  { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { id: 'luxury', label: 'Luxury', icon: Gem, color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { id: 'nature', label: 'Nature', icon: TreePine, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'culture', label: 'Culture', icon: Landmark, color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { id: 'nightlife', label: 'Nightlife', icon: Music, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'roadtrip', label: 'Road Trip', icon: CarFront, color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { id: 'relaxation', label: 'Relaxation', icon: Waves, color: 'bg-teal-50 border-teal-200 text-teal-700' },
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

/**
 * TripGeneratorForm — 6-step premium wizard for generating AI trip plans.
 *
 * Props:
 *  - onComplete(payload, prompt) — called when user submits the wizard
 *  - onClose — called when user cancels
 */
export function TripGeneratorForm({ onComplete, onClose }) {
  const store = useTripGeneratorStore();
  const [direction, setDirection] = React.useState(0);

  const handleNext = () => {
    if (!store.isStepValid()) return;
    setDirection(1);
    if (store.step === store.totalSteps) {
      // Final step: generate and submit
      const payload = store.generatePayload();
      const prompt = store.generatePrompt();
      onComplete?.(payload, prompt);
    } else {
      store.nextStep();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    store.prevStep();
  };

  const progress = (store.step / store.totalSteps) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEP_META.map((s) => {
            const Icon = s.icon;
            const isActive = store.step === s.num;
            const isDone = store.step > s.num;
            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    isActive ? 'text-amber-600' : isDone ? 'text-emerald-600' : 'text-neutral-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={store.step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-[400px]"
        >
          {store.step === 1 && <StepDestination store={store} />}
          {store.step === 2 && <StepDates store={store} />}
          {store.step === 3 && <StepTravelers store={store} />}
          {store.step === 4 && <StepBudget store={store} />}
          {store.step === 5 && <StepPreferences store={store} />}
          {store.step === 6 && <StepReview store={store} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
        <div>
          {store.step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-3 text-neutral-600 hover:text-neutral-900 font-semibold transition-colors rounded-xl hover:bg-neutral-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-neutral-400 hover:text-neutral-600 font-medium transition-colors rounded-xl"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!store.isStepValid()}
          className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg ${
            store.isStepValid()
              ? store.step === store.totalSteps
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
          }`}
        >
          {store.step === store.totalSteps ? (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Trip
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   STEP COMPONENTS
   ========================================================================= */

function StepDestination({ store }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Where do you want to go?</h2>
        <p className="text-neutral-500 font-medium">Search cities, countries, landmarks, or airports.</p>
      </div>
      <DestinationSearch
        onPlaceSelect={(place) => store.setDestination(place)}
        value={store.destination?.formattedAddress || ''}
        showCard={true}
      />
    </div>
  );
}

function StepDates({ store }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">When are you traveling?</h2>
        <p className="text-neutral-500 font-medium">Select your travel dates.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-600 mb-2">Start Date</label>
          <input
            type="date"
            value={store.startDate}
            min={today}
            onChange={(e) => store.setDates(e.target.value, store.endDate)}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-2xl text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-600 mb-2">End Date</label>
          <input
            type="date"
            value={store.endDate}
            min={store.startDate || today}
            onChange={(e) => store.setDates(store.startDate, e.target.value)}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-2xl text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
          />
        </div>
      </div>
      {store.startDate && store.endDate && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-sm font-semibold text-amber-700">
            📅 {Math.ceil((new Date(store.endDate) - new Date(store.startDate)) / (1000 * 60 * 60 * 24)) + 1} days trip
          </p>
        </div>
      )}
    </div>
  );
}

function StepTravelers({ store }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Who's traveling?</h2>
        <p className="text-neutral-500 font-medium">Select your travel style.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TRAVELER_TYPES.map((type) => {
          const isSelected = store.travelerType === type.id;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => store.setTravelerType(type.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                isSelected ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="font-bold text-neutral-900">{type.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{type.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      {store.travelerType && (
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
          <label className="block text-sm font-semibold text-neutral-600 mb-2">Number of travelers</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => store.setTravelerCount(Math.max(1, store.travelerCount - 1))}
              className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-lg font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-bold text-neutral-900 w-12 text-center">{store.travelerCount}</span>
            <button
              type="button"
              onClick={() => store.setTravelerCount(Math.min(20, store.travelerCount + 1))}
              className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-lg font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepBudget({ store }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">What's your budget?</h2>
        <p className="text-neutral-500 font-medium">All prices in ₹ INR. Choose a tier or set a custom amount.</p>
      </div>
      <BudgetSelector onBudgetSelect={(b) => store.setBudget(b)} value={store.budget} />
    </div>
  );
}

function StepPreferences({ store }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">What are you interested in?</h2>
        <p className="text-neutral-500 font-medium">Select at least one to personalize your trip.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PREFERENCES.map((pref) => {
          const isSelected = store.preferences.includes(pref.id);
          const Icon = pref.icon;
          return (
            <button
              key={pref.id}
              type="button"
              onClick={() => store.togglePreference(pref.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? `${pref.color} ring-2 ring-offset-1`
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{pref.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepReview({ store }) {
  const payload = store.generatePayload();
  const days =
    payload.startDate && payload.endDate
      ? Math.ceil((new Date(payload.endDate) - new Date(payload.startDate)) / (1000 * 60 * 60 * 24)) + 1
      : '—';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Review Your Trip</h2>
        <p className="text-neutral-500 font-medium">Make sure everything looks good before generating.</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 space-y-5">
        <ReviewRow icon={MapPin} label="Destination" value={`${payload.destination.city}, ${payload.destination.state}, ${payload.destination.country}`} />
        <ReviewRow icon={Calendar} label="Dates" value={`${payload.startDate} → ${payload.endDate} (${days} days)`} />
        <ReviewRow icon={Users} label="Travelers" value={`${payload.travelers} ${payload.travelers > 1 ? 'people' : 'person'} (${payload.travelerType})`} />
        <ReviewRow icon={Wallet} label="Budget" value={`${formatINR(payload.budget)} (${payload.budgetType})`} />
        <ReviewRow icon={Heart} label="Interests" value={payload.interests.map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')} />
      </div>

      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">AI will generate</p>
        <ul className="space-y-1 text-sm text-neutral-600">
          <li>✦ Day-by-day detailed itinerary</li>
          <li>✦ Hotel & restaurant recommendations</li>
          <li>✦ Activity timings & cost breakdowns in ₹ INR</li>
          <li>✦ Local tips & hidden gems</li>
        </ul>
      </div>
    </div>
  );
}

function ReviewRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-4 h-4 text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{label}</p>
        <p className="text-base font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
