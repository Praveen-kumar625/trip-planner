export const TRANSPORT_DATA = {
  'BALI01': [
    { mode: 'Car', duration: '1h 15m', cost: '₹1200', type: 'Private', icon: 'Car' },
    { mode: 'Taxi', duration: '1h 15m', cost: '₹1800', type: 'Private', icon: 'Taxi' },
    { mode: 'Scooter', duration: '1h 05m', cost: '₹400', type: 'Rental', icon: 'Bike' },
    { mode: 'Shuttle Bus', duration: '1h 45m', cost: '₹350', type: 'Public', icon: 'Bus' }
  ],
  'SANT01': [
    { mode: 'ATV', duration: '20 min', cost: '₹2500', type: 'Rental', icon: 'Bike' },
    { mode: 'Taxi', duration: '25 min', cost: '₹3000', type: 'Private', icon: 'Taxi' },
    { mode: 'Local Bus', duration: '40 min', cost: '₹180', type: 'Public', icon: 'Bus' }
  ],
  'KYOT01': [
    { mode: 'Bullet Train (Shinkansen)', duration: '15 min', cost: '₹1200', type: 'Public', icon: 'Train' },
    { mode: 'Local Train', duration: '45 min', cost: '₹400', type: 'Public', icon: 'Train' },
    { mode: 'Taxi', duration: '50 min', cost: '₹4500', type: 'Private', icon: 'Taxi' }
  ],
  'JAB01': [
    { mode: 'Car / Cab', duration: '42 min', cost: '₹350', type: 'Private', icon: 'Car' },
    { mode: 'Auto Rickshaw', duration: '55 min', cost: '₹220', type: 'Private', icon: 'Bike' },
    { mode: 'Local Bus', duration: '1h 10m', cost: '₹30', type: 'Public', icon: 'Bus' },
    { mode: 'Rental Bike', duration: '40 min', cost: '₹90', type: 'Rental', icon: 'Bike' }
  ]
};

export const getTransportData = (destinationId) => {
  return TRANSPORT_DATA[destinationId] || TRANSPORT_DATA['JAB01'];
};
