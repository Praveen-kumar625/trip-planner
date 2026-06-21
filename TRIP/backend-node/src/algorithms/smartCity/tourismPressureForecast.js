/**
 * Tourism Pressure Forecast
 * Predicts infrastructure load at specific POIs (Points of Interest).
 */

export const forecastTourismPressure = (poiList) => {
  return [
    { poi: 'Mall Road', pressureScore: 92, status: 'Critical', suggestedDiversion: 'Ridge' },
    { poi: 'Jakhoo Temple', pressureScore: 78, status: 'High', suggestedDiversion: 'Sankat Mochan' },
    { poi: 'Mashobra', pressureScore: 34, status: 'Low', suggestedDiversion: null }
  ];
};
