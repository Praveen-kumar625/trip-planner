import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DestinationSearch } from '../src/components/destination/DestinationSearch';

// Mock the hook so we don't try to load Google Maps API
vi.mock('../src/hooks/useDestinationSearch', () => ({
  useDestinationSearch: () => ({
    ready: true,
    value: '',
    inputRef: { current: null },
    suggestions: [
      { description: 'Paris, France', place_id: '1' },
      { description: 'London, UK', place_id: '2' }
    ],
    hasSuggestions: true,
    suggestionsLoading: false,
    selectedPlace: null,
    isResolving: false,
    resolveError: null,
    handleInput: vi.fn(),
    handleSelect: vi.fn(),
    handleClear: vi.fn(),
    handleDismiss: vi.fn(),
  })
}));

describe('DestinationSearch', () => {
  it('renders input placeholder', () => {
    render(<DestinationSearch />);
    expect(screen.getByPlaceholderText('Search cities, countries, landmarks, airports...')).toBeInTheDocument();
  });

  it('renders suggestions when they exist', async () => {
    render(<DestinationSearch value="Par" />);
    // Our mock forces hasSuggestions=true and returns 2 items
    await waitFor(() => {
      expect(screen.getByText('Paris, France')).toBeInTheDocument();
      expect(screen.getByText('London, UK')).toBeInTheDocument();
    });
  });
});
