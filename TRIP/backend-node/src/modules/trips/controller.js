import { TripService } from './service.js';
import { createTripSchema, updateTripSchema } from './schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const createTrip = catchAsync(async (req, res) => {
  const validatedData = createTripSchema.parse(req.body);
  const trip = await TripService.createTrip(req.user.uid, validatedData);
  res.status(201).json({ status: 'success', data: trip });
});

export const getTrips = catchAsync(async (req, res) => {
  const pageSize = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const startAfterDocId = req.query.cursor || null;
  const archived = req.query.archived === 'true';

  const result = await TripService.getTrips(req.user.uid, pageSize, startAfterDocId, archived);
  res.status(200).json({ status: 'success', data: result.trips, pagination: { nextCursor: result.lastDocId, hasMore: result.hasMore } });
});

export const getTripDetails = catchAsync(async (req, res) => {
  const trip = await TripService.getTripById(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: trip });
});

export const updateTrip = catchAsync(async (req, res) => {
  const validatedData = updateTripSchema.parse(req.body);
  const trip = await TripService.updateTrip(req.user.uid, req.params.tripId, validatedData);
  res.status(200).json({ status: 'success', data: trip });
});

export const deleteTrip = catchAsync(async (req, res) => {
  await TripService.deleteTrip(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', message: 'Trip deleted successfully' });
});

export const duplicateTrip = catchAsync(async (req, res) => {
  const trip = await TripService.duplicateTrip(req.user.uid, req.params.tripId);
  res.status(201).json({ status: 'success', data: trip });
});

export const archiveTrip = catchAsync(async (req, res) => {
  const trip = await TripService.archiveTrip(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: trip });
});
