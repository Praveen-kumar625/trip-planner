import { MapsService } from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const searchPlaces = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ status: 'error', message: 'Query parameter q is required' });
  
  const results = await MapsService.searchPlaces(q);
  res.status(200).json({ status: 'success', data: results });
});

export const getPlaceDetails = catchAsync(async (req, res, next) => {
  const { placeId } = req.params;
  const result = await MapsService.getPlaceDetails(placeId);
  res.status(200).json({ status: 'success', data: result });
});

export const autocomplete = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ status: 'error', message: 'Query parameter q is required' });
  
  const results = await MapsService.autocomplete(q);
  res.status(200).json({ status: 'success', data: results });
});
