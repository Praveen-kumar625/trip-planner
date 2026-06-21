export const TOURISM_DATA = {
  'BALI01': {
    attractions: [
      { name: 'Sacred Monkey Forest', rating: 4.8, type: 'Wildlife / Temple' },
      { name: 'Tegalalang Rice Terrace', rating: 4.9, type: 'Nature / Scenic' },
      { name: 'Campuhan Ridge Walk', rating: 4.7, type: 'Hiking / Nature' }
    ],
    hotels: 145,
    restaurants: 320,
    costEstimate: {
      budget: '₹3,500/day',
      standard: '₹8,000/day',
      luxury: '₹25,000/day'
    }
  },
  'JAB01': {
    attractions: [
      { name: 'Dhuandhar Falls', rating: 4.9, type: 'Waterfall / Nature' },
      { name: 'Marble Rocks Boating', rating: 4.8, type: 'Adventure / Scenic' },
      { name: 'Chausath Yogini Temple', rating: 4.6, type: 'Heritage / Temple' }
    ],
    hotels: 18,
    restaurants: 12,
    costEstimate: {
      budget: '₹1,500/day',
      standard: '₹3,500/day',
      luxury: '₹8,500/day'
    }
  }
};

export const getTourismData = (destinationId) => {
  return TOURISM_DATA[destinationId] || TOURISM_DATA['JAB01'];
};
