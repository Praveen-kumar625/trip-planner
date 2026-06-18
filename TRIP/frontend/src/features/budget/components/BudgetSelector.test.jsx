import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BudgetSelector, formatINR, BUDGET_TIERS } from './BudgetSelector';

describe('BudgetSelector', () => {
  let onBudgetSelect;

  beforeEach(() => {
    onBudgetSelect = vi.fn();
  });

  it('renders all 5 preset tiers plus custom', () => {
    const { getAllByRole } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    // 5 tiers + 1 custom = 6 buttons
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(6);
  });

  it('calls onBudgetSelect with correct data when a tier is clicked', () => {
    const { getByText } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    fireEvent.click(getByText('Backpacker'));

    expect(onBudgetSelect).toHaveBeenCalledWith({
      budgetType: 'Backpacker',
      totalBudget: 10000,
      currency: 'INR',
      breakdown: { accommodation: 40, food: 20, transport: 20, activities: 20 },
    });
  });

  it('calls onBudgetSelect with Premium tier data', () => {
    const { getByText } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    fireEvent.click(getByText('Premium'));

    expect(onBudgetSelect).toHaveBeenCalledWith({
      budgetType: 'Premium',
      totalBudget: 120000,
      currency: 'INR',
      breakdown: { accommodation: 40, food: 20, transport: 20, activities: 20 },
    });
  });

  it('shows custom slider when Custom is clicked', () => {
    const { getByText, getByRole } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    fireEvent.click(getByText('Custom'));

    // Slider should appear
    const slider = getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('updates budget when custom slider changes', () => {
    const { getByText, getByRole } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    fireEvent.click(getByText('Custom'));

    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '75000' } });

    expect(onBudgetSelect).toHaveBeenLastCalledWith({
      budgetType: 'Custom',
      totalBudget: 75000,
      currency: 'INR',
      breakdown: { accommodation: 40, food: 20, transport: 20, activities: 20 },
    });
  });

  it('always outputs INR currency', () => {
    const { getByText } = render(<BudgetSelector onBudgetSelect={onBudgetSelect} />);
    
    BUDGET_TIERS.forEach((tier) => {
      fireEvent.click(getByText(tier.label));
      const lastCall = onBudgetSelect.mock.calls[onBudgetSelect.mock.calls.length - 1][0];
      expect(lastCall.currency).toBe('INR');
    });
  });
});

describe('formatINR', () => {
  it('formats numbers in Indian numbering system', () => {
    expect(formatINR(1000)).toBe('₹1,000');
    expect(formatINR(15000)).toBe('₹15,000');
    expect(formatINR(150000)).toBe('₹1,50,000');
    expect(formatINR(1000000)).toBe('₹10,00,000');
  });

  it('handles zero and null', () => {
    expect(formatINR(0)).toBe('₹0');
    expect(formatINR(null)).toBe('₹0');
  });
});
