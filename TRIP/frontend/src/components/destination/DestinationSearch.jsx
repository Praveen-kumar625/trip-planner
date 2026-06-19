import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, X, AlertCircle, Loader2, Search } from 'lucide-react';
import { useDestinationSearch } from '@/hooks/useDestinationSearch';
import { DestinationDropdown } from './DestinationDropdown';
import { DestinationEmpty } from './DestinationEmpty';
import { DestinationSkeleton } from './DestinationSkeleton';
import { DestinationCard } from './DestinationCard';

/**
 * DestinationSearch — Premium Google-style destination autocomplete.
 *
 * Replaces the old LocationAutocomplete with a fully custom dropdown,
 * keyboard navigation, mobile-friendly design, and structured geocoding.
 *
 * Props:
 *  - onPlaceSelect(locationData | null) — called when user selects or clears a destination.
 *  - value — current display value for controlled mode.
 *  - placeholder — placeholder text.
 *  - className — additional wrapper class.
 *  - inputClassName — override the input class entirely.
 *  - showCard — whether to show the DestinationCard after selection (default: false).
 *  - types — Google Places type restrictions (default: ['(cities)']).
 */
export function DestinationSearch({
  onPlaceSelect,
  value = '',
  placeholder = 'Search cities, countries, landmarks, airports...',
  className = '',
  inputClassName = '',
  showCard = false,
  types = ['(cities)'],
}) {
  const {
    ready,
    value: searchValue,
    inputRef,
    suggestions,
    hasSuggestions,
    suggestionsLoading,
    selectedPlace,
    isResolving,
    resolveError,
    handleInput,
    handleSelect,
    handleClear,
    handleDismiss,
  } = useDestinationSearch({ types });

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const wrapperRef = useRef(null);

  // Sync controlled value prop on mount
  useEffect(() => {
    if (value && !searchValue) {
      handleInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open dropdown when suggestions arrive
  useEffect(() => {
    if (hasSuggestions) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  }, [hasSuggestions]);

  // Forward selection to parent
  useEffect(() => {
    if (selectedPlace) {
      onPlaceSelect?.(selectedPlace);
      setIsOpen(false);
    }
  }, [selectedPlace, onPlaceSelect]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        handleDismiss();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleDismiss]);

  const onInputChange = useCallback(
    (e) => {
      handleInput(e.target.value);
      setHasInteracted(true);
      if (!e.target.value) {
        setIsOpen(false);
      }
    },
    [handleInput]
  );

  const onSuggestionSelect = useCallback(
    async (prediction) => {
      setActiveIndex(-1);
      await handleSelect(prediction);
    },
    [handleSelect]
  );

  const onClear = useCallback(() => {
    handleClear();
    setIsOpen(false);
    setActiveIndex(-1);
    setHasInteracted(false);
    onPlaceSelect?.(null);
  }, [handleClear, onPlaceSelect]);

  /**
   * Full keyboard navigation:
   * ArrowDown/ArrowUp: navigate suggestions
   * Enter: select highlighted suggestion
   * Escape: close dropdown
   */
  const onKeyDown = useCallback(
    (e) => {
      if (!isOpen || !hasSuggestions) {
        // Open on ArrowDown if there are suggestions but dropdown is closed
        if (e.key === 'ArrowDown' && hasSuggestions) {
          setIsOpen(true);
          setActiveIndex(0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            onSuggestionSelect(suggestions[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          handleDismiss();
          setActiveIndex(-1);
          break;
        case 'Tab':
          setIsOpen(false);
          handleDismiss();
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    },
    [isOpen, hasSuggestions, suggestions, activeIndex, onSuggestionSelect, handleDismiss]
  );

  // Determine the visual state of the input
  const hasSelection = !!selectedPlace;
  const showDropdown = isOpen && searchValue.length > 0 && !hasSelection;
  const showEmpty = showDropdown && hasInteracted && !hasSuggestions && !suggestionsLoading && searchValue.length >= 2;

  // Not ready — Google Maps script not yet loaded
  if (!ready) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-3 px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <span className="text-sm font-medium">Loading destination search...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative group">
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {isResolving ? (
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          ) : hasSelection ? (
            <MapPin className="w-5 h-5 text-emerald-500" />
          ) : (
            <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
          )}
        </div>

        <input
          ref={inputRef}
          id="destination-search-input"
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="destination-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `destination-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search destinations"
          autoComplete="off"
          value={searchValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (hasSuggestions && !hasSelection) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={
            inputClassName ||
            `w-full pl-12 pr-12 py-4 bg-white border rounded-2xl text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
              resolveError
                ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
                : hasSelection
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-neutral-200 hover:border-neutral-300'
            }`
          }
        />

        {/* Right: Clear / Loading */}
        {searchValue && !isResolving && (
          <button
            onClick={onClear}
            type="button"
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error */}
      {resolveError && (
        <div className="flex items-center gap-2 mt-2 px-2 text-red-500 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{resolveError}</span>
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[100] w-full mt-2 bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-2xl shadow-neutral-900/10 overflow-hidden"
          >
            {suggestionsLoading && !hasSuggestions ? (
              <DestinationSkeleton />
            ) : hasSuggestions ? (
              <DestinationDropdown
                suggestions={suggestions}
                onSelect={onSuggestionSelect}
                activeIndex={activeIndex}
              />
            ) : showEmpty ? (
              <DestinationEmpty query={searchValue} />
            ) : null}

            {/* Google Attribution */}
            <div className="px-4 py-2 border-t border-neutral-100 flex items-center justify-end">
              <span className="text-[10px] text-neutral-400 font-medium">
                Powered by Google
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destination Card (optional) */}
      {showCard && (
        <AnimatePresence>
          {selectedPlace && (
            <div className="mt-4">
              <DestinationCard
                location={selectedPlace}
                onClear={onClear}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
