import { MapsService } from './service.js';

export const searchPlaces = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: 'error', message: 'Query parameter q is required' });
    
    const results = await MapsService.searchPlaces(q);
    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    next(error);
  }
};

export const getPlaceDetails = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const result = await MapsService.getPlaceDetails(placeId);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: 'error', message: 'Query parameter q is required' });
    
    const results = await MapsService.autocomplete(q);
    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    next(error);
  }
};
