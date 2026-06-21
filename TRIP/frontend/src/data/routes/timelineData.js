export const TIMELINE_DATA = {
  'BALI01': [
    { time: '08:00 AM', title: 'Depart Denpasar Airport', description: 'Begin journey to Ubud' },
    { time: '08:45 AM', title: 'Coffee Stop', description: 'Bali Pulina Coffee Plantation' },
    { time: '09:15 AM', title: 'Arrive in Ubud', description: 'Check-in at Hotel' },
    { time: '10:00 AM', title: 'Monkey Forest', description: 'Explore the sacred sanctuary' }
  ],
  'JAB01': [
    { time: '09:00 AM', title: 'Depart Jabalpur', description: 'Start journey from city center' },
    { time: '09:25 AM', title: 'Reach Bhedaghat Entry', description: 'Toll plaza and parking' },
    { time: '09:40 AM', title: 'Boating Point', description: 'Marble Rocks boat ride ticket counter' },
    { time: '10:00 AM', title: 'Marble Rocks', description: 'Enjoy the scenic boat ride' },
    { time: '10:30 AM', title: 'Dhuandhar Falls', description: 'View the magnificent waterfall and ropeway' }
  ]
};

export const getTimelineData = (destinationId) => {
  return TIMELINE_DATA[destinationId] || TIMELINE_DATA['JAB01'];
};
