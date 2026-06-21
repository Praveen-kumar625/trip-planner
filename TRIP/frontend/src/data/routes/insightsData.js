export const INSIGHTS_DATA = {
  'BALI01': [
    "Best visited during early morning to avoid the midday heat.",
    "Traffic around Ubud center usually increases after 11 AM.",
    "Carry a sarong for temple visits.",
    "Monkey Forest requires caution with loose items."
  ],
  'JAB01': [
    "Best visited during sunrise for magical lighting on Marble Rocks.",
    "Traffic usually increases after 5 PM on the Jabalpur-Bhedaghat road.",
    "Carry water during the summer season as it gets very hot.",
    "Boating is most popular between 10 AM and 4 PM.",
    "Weekend crowd expected at Dhuandhar Falls."
  ]
};

export const getInsightsData = (destinationId) => {
  return INSIGHTS_DATA[destinationId] || INSIGHTS_DATA['JAB01'];
};
