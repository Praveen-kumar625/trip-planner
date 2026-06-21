import axios from "axios";

// Dummy data for presentation mode
const DUMMY_PLACES = [
  {
    eLoc: "BALI01",
    placeName: "Ubud, Bali",
    placeAddress: "Indonesia",
    type: "City",
    latitude: -8.5069,
    longitude: 115.2625
  },
  {
    eLoc: "SANT01",
    placeName: "Santorini",
    placeAddress: "Aegean Sea, Greece",
    type: "Island",
    latitude: 36.3932,
    longitude: 25.4615
  },
  {
    eLoc: "KYOT01",
    placeName: "Kyoto",
    placeAddress: "Kansai, Japan",
    type: "City",
    latitude: 35.0116,
    longitude: 135.7681
  },
  {
    eLoc: "PARI01",
    placeName: "Paris",
    placeAddress: "Île-de-France, France",
    type: "City",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    eLoc: "TULU01",
    placeName: "Tulum",
    placeAddress: "Quintana Roo, Mexico",
    type: "Coastal Town",
    latitude: 20.2114,
    longitude: -87.4654
  },
  {
    eLoc: "AMAL01",
    placeName: "Amalfi Coast",
    placeAddress: "Campania, Italy",
    type: "Coastal Region",
    latitude: 40.6333,
    longitude: 14.6029
  },
  {
    eLoc: "JAB01",
    placeName: "Bhedaghat",
    placeAddress: "Jabalpur, Madhya Pradesh, India",
    type: "Landmark",
    latitude: 23.1305,
    longitude: 79.8000
  },
  {
    eLoc: "KHAJ01",
    placeName: "Khajuraho",
    placeAddress: "Madhya Pradesh, India",
    type: "Heritage City",
    latitude: 24.8318,
    longitude: 79.9199
  },
  {
    eLoc: "PACH01",
    placeName: "Pachmarhi",
    placeAddress: "Madhya Pradesh, India",
    type: "Hill Station",
    latitude: 22.4674,
    longitude: 78.4346
  },
  {
    eLoc: "UJJ01",
    placeName: "Mahakaleshwar Temple",
    placeAddress: "Ujjain, Madhya Pradesh, India",
    type: "Temple",
    latitude: 23.1827,
    longitude: 75.7682
  },
  {
    eLoc: "GOA01",
    placeName: "Palolem Beach",
    placeAddress: "Goa, India",
    type: "Beach",
    latitude: 15.0100,
    longitude: 74.0232
  },
  {
    eLoc: "VAR01",
    placeName: "Varanasi Ghats",
    placeAddress: "Uttar Pradesh, India",
    type: "Landmark",
    latitude: 25.3176,
    longitude: 83.0062
  }
];

export const SearchMapplsPlaces = async (query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const q = (query || '').toLowerCase();
  const results = DUMMY_PLACES.filter(p => 
    p.placeName.toLowerCase().includes(q) ||
    p.placeAddress.toLowerCase().includes(q)
  );

  return {
    data: {
      suggestedLocations: results.length > 0 ? results : DUMMY_PLACES
    }
  };
};

export const GetPlaceDetails = async (eLoc) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const place = DUMMY_PLACES.find(p => p.eLoc === eLoc) || DUMMY_PLACES[0];
  
  return {
    data: {
      copResults: {
        ...place,
        city: place.placeName
      }
    }
  };
};
