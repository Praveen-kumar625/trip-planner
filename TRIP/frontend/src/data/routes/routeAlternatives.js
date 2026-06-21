export const ROUTE_ALTERNATIVES = {
  'BALI01': [
    { type: 'Fastest', distance: '37 km', duration: '1h 15m', cost: '₹1200', safety: '88/100', color: 'from-blue-400 to-blue-600' },
    { type: 'Scenic', distance: '45 km', duration: '1h 40m', cost: '₹1400', safety: '85/100', color: 'from-amber-400 to-orange-500' },
    { type: 'Budget', distance: '38 km', duration: '1h 45m', cost: '₹350', safety: '80/100', color: 'from-emerald-400 to-emerald-600' }
  ],
  'JAB01': [
    { type: 'Fastest', distance: '25 km', duration: '42 min', cost: '₹350', safety: '92/100', color: 'from-blue-400 to-blue-600' },
    { type: 'Scenic', distance: '31 km', duration: '55 min', cost: '₹420', safety: '89/100', color: 'from-amber-400 to-orange-500' },
    { type: 'Budget', distance: '28 km', duration: '1h 10m', cost: '₹30', safety: '85/100', color: 'from-emerald-400 to-emerald-600' },
    { type: 'Eco', distance: '27 km', duration: '50 min', cost: '₹150', safety: '90/100', color: 'from-teal-400 to-teal-600' }
  ]
};

export const getRouteAlternatives = (destinationId) => {
  return ROUTE_ALTERNATIVES[destinationId] || ROUTE_ALTERNATIVES['JAB01'];
};
