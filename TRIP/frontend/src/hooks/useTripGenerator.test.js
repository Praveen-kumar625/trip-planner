import { describe, it, expect, beforeEach } from 'vitest';
import { useTripGeneratorStore } from './useTripGenerator';

describe('useTripGeneratorStore', () => {
  beforeEach(() => {
    useTripGeneratorStore.getState().reset();
  });

  it('initializes at step 1', () => {
    expect(useTripGeneratorStore.getState().step).toBe(1);
  });

  it('advances and retreats steps correctly', () => {
    const store = useTripGeneratorStore.getState();
    store.nextStep();
    expect(useTripGeneratorStore.getState().step).toBe(2);
    store.nextStep();
    expect(useTripGeneratorStore.getState().step).toBe(3);
    store.prevStep();
    expect(useTripGeneratorStore.getState().step).toBe(2);
  });

  it('does not go below step 1', () => {
    const store = useTripGeneratorStore.getState();
    store.prevStep();
    expect(useTripGeneratorStore.getState().step).toBe(1);
  });

  it('does not exceed total steps', () => {
    const store = useTripGeneratorStore.getState();
    for (let i = 0; i < 10; i++) store.nextStep();
    expect(useTripGeneratorStore.getState().step).toBe(6);
  });

  it('sets destination', () => {
    useTripGeneratorStore.getState().setDestination({
      placeId: 'abc123',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
    });
    expect(useTripGeneratorStore.getState().destination.city).toBe('Udaipur');
  });

  it('sets dates', () => {
    useTripGeneratorStore.getState().setDates('2026-07-01', '2026-07-05');
    const s = useTripGeneratorStore.getState();
    expect(s.startDate).toBe('2026-07-01');
    expect(s.endDate).toBe('2026-07-05');
  });

  it('sets traveler type and adjusts count', () => {
    useTripGeneratorStore.getState().setTravelerType('couple');
    expect(useTripGeneratorStore.getState().travelerType).toBe('couple');
    expect(useTripGeneratorStore.getState().travelerCount).toBe(2);
  });

  it('sets budget', () => {
    useTripGeneratorStore.getState().setBudget({
      budgetType: 'Premium',
      totalBudget: 120000,
      currency: 'INR',
      breakdown: { accommodation: 40, food: 20, transport: 20, activities: 20 },
    });
    expect(useTripGeneratorStore.getState().budget.totalBudget).toBe(120000);
    expect(useTripGeneratorStore.getState().budget.currency).toBe('INR');
  });

  it('toggles preferences', () => {
    const store = useTripGeneratorStore.getState();
    store.togglePreference('food');
    store.togglePreference('culture');
    expect(useTripGeneratorStore.getState().preferences).toEqual(['food', 'culture']);

    store.togglePreference('food'); // remove
    expect(useTripGeneratorStore.getState().preferences).toEqual(['culture']);
  });

  it('validates step 1 requires destination', () => {
    expect(useTripGeneratorStore.getState().isStepValid()).toBe(false);
    useTripGeneratorStore.getState().setDestination({ placeId: 'test' });
    expect(useTripGeneratorStore.getState().isStepValid()).toBe(true);
  });

  it('generates structured payload', () => {
    const store = useTripGeneratorStore.getState();
    store.setDestination({
      placeId: 'abc',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 24.58,
      longitude: 73.68,
    });
    store.setDates('2026-07-01', '2026-07-05');
    store.setTravelerType('couple');
    store.setBudget({ budgetType: 'Standard', totalBudget: 60000, currency: 'INR', breakdown: {} });
    store.togglePreference('food');
    store.togglePreference('culture');

    const payload = useTripGeneratorStore.getState().generatePayload();
    expect(payload.destination.city).toBe('Udaipur');
    expect(payload.travelers).toBe(2);
    expect(payload.budget).toBe(60000);
    expect(payload.currency).toBe('INR');
    expect(payload.interests).toEqual(['food', 'culture']);
  });

  it('generates a non-empty AI prompt string', () => {
    const store = useTripGeneratorStore.getState();
    store.setDestination({
      placeId: 'abc',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 26.9,
      longitude: 75.8,
    });
    store.setDates('2026-07-01', '2026-07-03');
    store.setTravelerType('solo');
    store.setBudget({ budgetType: 'Budget', totalBudget: 25000, currency: 'INR', breakdown: {} });
    store.togglePreference('adventure');

    const prompt = useTripGeneratorStore.getState().generatePrompt();
    expect(prompt).toContain('Jaipur');
    expect(prompt).toContain('Rajasthan');
    expect(prompt).toContain('25,000');
    expect(prompt).toContain('adventure');
    expect(prompt).toContain('INR');
  });

  it('resets all state', () => {
    const store = useTripGeneratorStore.getState();
    store.setStep(4);
    store.setDestination({ placeId: 'test' });
    store.setDates('2026-01-01', '2026-01-05');
    store.setBudget({ totalBudget: 100000 });
    store.togglePreference('food');

    store.reset();
    const s = useTripGeneratorStore.getState();
    expect(s.step).toBe(1);
    expect(s.destination).toBeNull();
    expect(s.startDate).toBe('');
    expect(s.budget).toBeNull();
    expect(s.preferences).toEqual([]);
  });
});
