import React, { useState, useCallback } from 'react';
import { Backpack, Wallet, CreditCard, Crown, Gem, SlidersHorizontal } from 'lucide-react';

const BUDGET_TIERS = [
  {
    id: 'backpacker',
    label: 'Backpacker',
    range: '₹5,000 – ₹15,000',
    min: 5000,
    max: 15000,
    default: 10000,
    icon: Backpack,
    color: 'emerald',
    description: 'Hostels, street food, public transport',
    bgClass: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    activeClass: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20',
    iconBgClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    id: 'budget',
    label: 'Budget',
    range: '₹15,000 – ₹40,000',
    min: 15000,
    max: 40000,
    default: 25000,
    icon: Wallet,
    color: 'blue',
    description: 'Budget hotels, local restaurants',
    bgClass: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    activeClass: 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20',
    iconBgClass: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'standard',
    label: 'Standard',
    range: '₹40,000 – ₹80,000',
    min: 40000,
    max: 80000,
    default: 60000,
    icon: CreditCard,
    color: 'violet',
    description: '3-4 star hotels, curated dining',
    bgClass: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    activeClass: 'bg-violet-50 border-violet-500 ring-2 ring-violet-500/20',
    iconBgClass: 'bg-violet-100 text-violet-600',
  },
  {
    id: 'premium',
    label: 'Premium',
    range: '₹80,000 – ₹1,50,000',
    min: 80000,
    max: 150000,
    default: 120000,
    icon: Crown,
    color: 'amber',
    description: '5-star stays, private tours',
    bgClass: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    activeClass: 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20',
    iconBgClass: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    range: '₹1,50,000+',
    min: 150000,
    max: 1000000,
    default: 300000,
    icon: Gem,
    color: 'rose',
    description: 'Ultra-luxury resorts, bespoke experiences',
    bgClass: 'bg-rose-50 border-rose-200 hover:border-rose-400',
    activeClass: 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20',
    iconBgClass: 'bg-rose-100 text-rose-600',
  },
];

const DEFAULT_BREAKDOWN = {
  accommodation: 40,
  food: 20,
  transport: 20,
  activities: 20,
};

/**
 * Format number in Indian numbering system (e.g., 1,50,000)
 */
function formatINR(num) {
  if (num == null) return '₹0';
  const str = Math.round(num).toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

/**
 * BudgetSelector — Premium INR budget selector with 5 tiers and custom slider.
 *
 * Props:
 *  - onBudgetSelect({ budgetType, totalBudget, currency, breakdown })
 *  - value — current budget data (controlled)
 */
export function BudgetSelector({ onBudgetSelect, value }) {
  const [selectedTier, setSelectedTier] = useState(value?.budgetType || null);
  const [customMode, setCustomMode] = useState(value?.budgetType === 'custom');
  const [customAmount, setCustomAmount] = useState(value?.totalBudget || 50000);

  const handleTierSelect = useCallback((tier) => {
    setSelectedTier(tier.id);
    setCustomMode(false);
    const budgetData = {
      budgetType: tier.label,
      totalBudget: tier.default,
      currency: 'INR',
      breakdown: { ...DEFAULT_BREAKDOWN },
    };
    onBudgetSelect?.(budgetData);
  }, [onBudgetSelect]);

  const handleCustomToggle = useCallback(() => {
    setCustomMode(true);
    setSelectedTier(null);
    const budgetData = {
      budgetType: 'Custom',
      totalBudget: customAmount,
      currency: 'INR',
      breakdown: { ...DEFAULT_BREAKDOWN },
    };
    onBudgetSelect?.(budgetData);
  }, [customAmount, onBudgetSelect]);

  const handleSliderChange = useCallback((e) => {
    const val = Number(e.target.value);
    setCustomAmount(val);
    const budgetData = {
      budgetType: 'Custom',
      totalBudget: val,
      currency: 'INR',
      breakdown: { ...DEFAULT_BREAKDOWN },
    };
    onBudgetSelect?.(budgetData);
  }, [onBudgetSelect]);

  return (
    <div className="space-y-4">
      {/* Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BUDGET_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id && !customMode;
          const Icon = tier.icon;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => handleTierSelect(tier)}
              className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSelected ? tier.activeClass : tier.bgClass
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tier.iconBgClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-neutral-900">{tier.label}</p>
                <p className="text-sm font-semibold text-neutral-600">{tier.range}</p>
                <p className="text-xs text-neutral-400 mt-1">{tier.description}</p>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}

        {/* Custom Budget Card */}
        <button
          type="button"
          onClick={handleCustomToggle}
          className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
            customMode
              ? 'bg-neutral-50 border-neutral-900 ring-2 ring-neutral-900/10'
              : 'bg-neutral-50 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-neutral-200 text-neutral-600">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-neutral-900">Custom</p>
            <p className="text-sm font-semibold text-neutral-600">Set your own budget</p>
            <p className="text-xs text-neutral-400 mt-1">Full flexibility</p>
          </div>
          {customMode && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Custom Slider */}
      {customMode && (
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">Your Budget</span>
            <span className="text-2xl font-bold text-neutral-900">{formatINR(customAmount)}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={1000000}
            step={5000}
            value={customAmount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-amber-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-neutral-400 font-medium">
            <span>₹5,000</span>
            <span>₹10,00,000</span>
          </div>

          {/* Budget Breakdown Preview */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Suggested Breakdown</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DEFAULT_BREAKDOWN).map(([key, pct]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-neutral-100">
                  <span className="text-sm text-neutral-600 capitalize">{key}</span>
                  <span className="text-sm font-bold text-neutral-900">{formatINR(customAmount * pct / 100)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { formatINR, BUDGET_TIERS };
