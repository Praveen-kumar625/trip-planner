const reliableImages = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop', // Cinematic mountains/lake
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop', // Paris sunset
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop', // Tropical beach
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop', // Dubai luxury
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop', // Sydney harbour
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop', // Maldives overwater
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2000&auto=format&fit=crop', // Amalfi coast
  'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2000&auto=format&fit=crop', // Kyoto temples
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000&auto=format&fit=crop', // Zermatt alps
  'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?q=80&w=2000&auto=format&fit=crop', // High mountains
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop', // Globe map style
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop', // Adventure van
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', // Romantic resort
];

export const globalDestinations = [
  // --- INDIA LUXURY ---
  { id: 'ind-jaipur', title: 'Jaipur', location: 'Rajasthan, India', image: reliableImages[0], mood: 'Royal Heritage', bestSeason: 'Oct - March', budget: '₹50,000 - ₹1,20,000' },
  { id: 'ind-udaipur', title: 'Udaipur', location: 'Rajasthan, India', image: reliableImages[1], mood: 'Lakefront Romance', bestSeason: 'Oct - March', budget: '₹70,000 - ₹1,50,000' },
  { id: 'ind-kerala', title: 'Munnar', location: 'Kerala, India', image: reliableImages[2], mood: 'Tea Estate Retreat', bestSeason: 'Sept - May', budget: '₹40,000 - ₹90,000' },
  { id: 'ind-goa', title: 'South Goa', location: 'Goa, India', image: reliableImages[3], mood: 'Private Beach Luxury', bestSeason: 'Nov - Feb', budget: '₹60,000 - ₹1,80,000' },
  { id: 'ind-ladakh', title: 'Leh', location: 'Ladakh, India', image: reliableImages[4], mood: 'Himalayan Expedition', bestSeason: 'May - Sept', budget: '₹45,000 - ₹1,10,000' },
  { id: 'ind-varanasi', title: 'Varanasi', location: 'Uttar Pradesh, India', image: reliableImages[5], mood: 'Spiritual Awakening', bestSeason: 'Nov - Feb', budget: '₹30,000 - ₹70,000' },
  { id: 'ind-andaman', title: 'Havelock', location: 'Andaman, India', image: reliableImages[6], mood: 'Tropical Isolation', bestSeason: 'Oct - May', budget: '₹80,000 - ₹2,00,000' },
  { id: 'ind-rishikesh', title: 'Rishikesh', location: 'Uttarakhand, India', image: reliableImages[7], mood: 'Yoga Wellness', bestSeason: 'Sept - Nov', budget: '₹35,000 - ₹85,000' },
  { id: 'ind-hampi', title: 'Hampi', location: 'Karnataka, India', image: reliableImages[8], mood: 'Ancient Ruins', bestSeason: 'Oct - March', budget: '₹25,000 - ₹60,000' },
  { id: 'ind-agra', title: 'Agra', location: 'Uttar Pradesh, India', image: reliableImages[9], mood: 'Iconic Marvel', bestSeason: 'Oct - March', budget: '₹40,000 - ₹1,00,000' },
  { id: 'ind-spiti', title: 'Spiti Valley', location: 'Himachal, India', image: reliableImages[10], mood: 'High Altitude Desert', bestSeason: 'June - Oct', budget: '₹45,000 - ₹95,000' },
  { id: 'ind-jaisalmer', title: 'Jaisalmer', location: 'Rajasthan, India', image: reliableImages[11], mood: 'Desert Oasis', bestSeason: 'Nov - March', budget: '₹55,000 - ₹1,30,000' },
  { id: 'ind-darjeeling', title: 'Darjeeling', location: 'West Bengal, India', image: reliableImages[12], mood: 'Colonial Charm', bestSeason: 'March - May', budget: '₹30,000 - ₹80,000' },
  { id: 'ind-meghalaya', title: 'Shillong', location: 'Meghalaya, India', image: reliableImages[0], mood: 'Cloud Forest', bestSeason: 'Oct - April', budget: '₹40,000 - ₹90,000' },
  { id: 'ind-mysore', title: 'Mysuru', location: 'Karnataka, India', image: reliableImages[1], mood: 'Palatial Grandeur', bestSeason: 'Sept - Feb', budget: '₹30,000 - ₹75,000' },

  // --- GLOBAL DESTINATIONS ---
  { id: 'jp-kyoto', title: 'Kyoto', location: 'Japan', image: reliableImages[7], mood: 'Zen Tranquility', bestSeason: 'March - May', budget: '₹1,50,000 - ₹3,00,000' },
  { id: 'it-amalfi', title: 'Amalfi Coast', location: 'Italy', image: reliableImages[6], mood: 'Riviera Glamour', bestSeason: 'May - Sept', budget: '₹2,00,000 - ₹5,00,000' },
  { id: 'id-bali', title: 'Ubud', location: 'Bali', image: reliableImages[2], mood: 'Jungle Sanctuary', bestSeason: 'April - Oct', budget: '₹80,000 - ₹2,00,000' },
  { id: 'gr-santorini', title: 'Santorini', location: 'Greece', image: reliableImages[3], mood: 'Aegean Romance', bestSeason: 'June - Sept', budget: '₹2,50,000 - ₹4,50,000' },
  { id: 'ch-zermatt', title: 'Zermatt', location: 'Switzerland', image: reliableImages[8], mood: 'Alpine Exclusivity', bestSeason: 'Dec - March', budget: '₹3,00,000 - ₹6,00,000' },
  { id: 'mv-maldives', title: 'Malé Atoll', location: 'Maldives', image: reliableImages[5], mood: 'Overwater Luxury', bestSeason: 'Nov - April', budget: '₹2,50,000 - ₹8,00,000' },
  { id: 'fr-paris', title: 'Paris', location: 'France', image: reliableImages[1], mood: 'Classic Elegance', bestSeason: 'April - June', budget: '₹1,50,000 - ₹3,50,000' },
  { id: 'is-reykjavik', title: 'Reykjavik', location: 'Iceland', image: reliableImages[9], mood: 'Nordic Wonder', bestSeason: 'Sept - March', budget: '₹2,00,000 - ₹4,00,000' },
  { id: 'us-nyc', title: 'Manhattan', location: 'New York, USA', image: reliableImages[4], mood: 'Metropolitan Energy', bestSeason: 'Sept - Dec', budget: '₹2,00,000 - ₹5,00,000' },
  { id: 'ae-dubai', title: 'Dubai', location: 'UAE', image: reliableImages[3], mood: 'Desert Opulence', bestSeason: 'Nov - March', budget: '₹1,00,000 - ₹3,00,000' },
  { id: 'nz-queenstown', title: 'Queenstown', location: 'New Zealand', image: reliableImages[0], mood: 'Scenic Adventure', bestSeason: 'Dec - Feb', budget: '₹2,50,000 - ₹5,00,000' },
  { id: 'ma-marrakech', title: 'Marrakech', location: 'Morocco', image: reliableImages[11], mood: 'Riad Hideaway', bestSeason: 'March - May', budget: '₹1,20,000 - ₹2,50,000' },
  { id: 'th-phuket', title: 'Phuket', location: 'Thailand', image: reliableImages[2], mood: 'Tropical Resort', bestSeason: 'Nov - Feb', budget: '₹60,000 - ₹1,50,000' },
  { id: 'au-sydney', title: 'Sydney', location: 'Australia', image: reliableImages[4], mood: 'Harbour Lifestyle', bestSeason: 'Sept - Nov', budget: '₹2,00,000 - ₹4,50,000' },
  { id: 'tr-cappadocia', title: 'Cappadocia', location: 'Turkey', image: reliableImages[8], mood: 'Fairy Chimneys', bestSeason: 'April - June', budget: '₹1,00,000 - ₹2,20,000' },
  { id: 'es-barcelona', title: 'Barcelona', location: 'Spain', image: reliableImages[7], mood: 'Mediterranean Art', bestSeason: 'May - June', budget: '₹1,50,000 - ₹3,00,000' },
  { id: 'za-cpt', title: 'Cape Town', location: 'South Africa', image: reliableImages[0], mood: 'Coastal Vineyards', bestSeason: 'Nov - Feb', budget: '₹1,80,000 - ₹3,50,000' },
  { id: 'pe-cusco', title: 'Machu Picchu', location: 'Peru', image: reliableImages[9], mood: 'Incan Mystery', bestSeason: 'May - Sept', budget: '₹2,00,000 - ₹4,00,000' },
  { id: 'pt-lisbon', title: 'Lisbon', location: 'Portugal', image: reliableImages[6], mood: 'Historic Coast', bestSeason: 'March - May', budget: '₹1,20,000 - ₹2,50,000' },
  { id: 'br-rio', title: 'Rio de Janeiro', location: 'Brazil', image: reliableImages[2], mood: 'Tropical Energy', bestSeason: 'Dec - March', budget: '₹1,80,000 - ₹3,50,000' },
  { id: 'eg-cairo', title: 'Cairo', location: 'Egypt', image: reliableImages[8], mood: 'Ancient Wonders', bestSeason: 'Oct - April', budget: '₹1,00,000 - ₹2,00,000' },
  { id: 'vn-halong', title: 'Ha Long Bay', location: 'Vietnam', image: reliableImages[5], mood: 'Emerald Waters', bestSeason: 'Oct - Dec', budget: '₹60,000 - ₹1,20,000' },
  { id: 'ca-banff', title: 'Banff', location: 'Canada', image: reliableImages[0], mood: 'Glacial Serenity', bestSeason: 'June - Aug', budget: '₹2,00,000 - ₹4,00,000' },
  { id: 'mx-tulum', title: 'Tulum', location: 'Mexico', image: reliableImages[2], mood: 'Boho Beach', bestSeason: 'Nov - Dec', budget: '₹1,50,000 - ₹3,00,000' },
  { id: 'kr-seoul', title: 'Seoul', location: 'South Korea', image: reliableImages[1], mood: 'Urban Future', bestSeason: 'Sept - Nov', budget: '₹1,20,000 - ₹2,50,000' },
  { id: 'hr-dubrovnik', title: 'Dubrovnik', location: 'Croatia', image: reliableImages[6], mood: 'Adriatic Pearl', bestSeason: 'May - Sept', budget: '₹1,50,000 - ₹3,00,000' },
  { id: 'sc-edinburgh', title: 'Edinburgh', location: 'Scotland', image: reliableImages[11], mood: 'Gothic Charm', bestSeason: 'May - Aug', budget: '₹1,80,000 - ₹3,50,000' },
  { id: 'no-lofoten', title: 'Lofoten', location: 'Norway', image: reliableImages[9], mood: 'Fjord Seclusion', bestSeason: 'June - Aug', budget: '₹2,50,000 - ₹5,00,000' },
  { id: 'jo-petra', title: 'Petra', location: 'Jordan', image: reliableImages[8], mood: 'Rose City', bestSeason: 'March - May', budget: '₹1,20,000 - ₹2,50,000' },
  { id: 'mu-mauritius', title: 'Le Morne', location: 'Mauritius', image: reliableImages[5], mood: 'Ocean Paradise', bestSeason: 'May - Dec', budget: '₹1,50,000 - ₹3,00,000' },
  { id: 'ar-patagonia', title: 'Patagonia', location: 'Argentina', image: reliableImages[0], mood: 'Wild Frontier', bestSeason: 'Nov - March', budget: '₹2,50,000 - ₹4,50,000' },
  { id: 'sg-singapore', title: 'Singapore', location: 'Singapore', image: reliableImages[4], mood: 'Modern Oasis', bestSeason: 'Feb - April', budget: '₹80,000 - ₹2,00,000' },
  { id: 'gb-london', title: 'London', location: 'UK', image: reliableImages[12], mood: 'Royal Heritage', bestSeason: 'May - Sept', budget: '₹1,80,000 - ₹4,00,000' },
  { id: 'nl-amsterdam', title: 'Amsterdam', location: 'Netherlands', image: reliableImages[1], mood: 'Canal City', bestSeason: 'April - May', budget: '₹1,50,000 - ₹3,50,000' },
  { id: 'cz-prague', title: 'Prague', location: 'Czechia', image: reliableImages[11], mood: 'Bohemian Magic', bestSeason: 'May - Sept', budget: '₹1,00,000 - ₹2,20,000' },
  { id: 'us-hawaii', title: 'Kauai', location: 'Hawaii, USA', image: reliableImages[2], mood: 'Volcanic Island', bestSeason: 'Sept - Nov', budget: '₹3,00,000 - ₹6,00,000' }
];
