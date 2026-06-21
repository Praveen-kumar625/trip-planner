import { getRouteData } from './routeData';
import { getTransportData } from './transportData';
import { getRouteAlternatives } from './routeAlternatives';
import { getTourismData } from './tourismData';
import { getTimelineData } from './timelineData';
import { getInsightsData } from './insightsData';

export const DummyRouteEngine = {
  getRouteIntelligence: (destinationId) => {
    // Return all composite data for a location
    return {
      route: getRouteData(destinationId),
      transport: getTransportData(destinationId),
      alternatives: getRouteAlternatives(destinationId),
      tourism: getTourismData(destinationId),
      timeline: getTimelineData(destinationId),
      insights: getInsightsData(destinationId)
    };
  }
};
