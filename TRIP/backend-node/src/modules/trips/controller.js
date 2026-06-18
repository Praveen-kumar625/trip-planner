import { TripService } from './service.js';
import { createTripSchema, updateTripSchema } from './schemas.js';

export const createTrip = async (req, res, next) => {
  try {
    const validatedData = createTripSchema.parse(req.body);
    const trip = await TripService.createTrip(req.user.uid, validatedData);
    res.status(201).json({ status: 'success', data: trip });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.errors });
    }
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const pageSize = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const startAfterDocId = req.query.cursor || null;
    const archived = req.query.archived === 'true';

    const result = await TripService.getTrips(req.user.uid, pageSize, startAfterDocId, archived);
    res.status(200).json({ status: 'success', data: result.trips, pagination: { nextCursor: result.lastDocId, hasMore: result.hasMore } });
  } catch (error) {
    next(error);
  }
};

export const getTripDetails = async (req, res, next) => {
  try {
    const trip = await TripService.getTripById(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: trip });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const validatedData = updateTripSchema.parse(req.body);
    const trip = await TripService.updateTrip(req.user.uid, req.params.tripId, validatedData);
    res.status(200).json({ status: 'success', data: trip });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.errors });
    }
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await TripService.deleteTrip(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const duplicateTrip = async (req, res, next) => {
  try {
    const trip = await TripService.duplicateTrip(req.user.uid, req.params.tripId);
    res.status(201).json({ status: 'success', data: trip });
  } catch (error) {
    next(error);
  }
};

export const archiveTrip = async (req, res, next) => {
  try {
    const trip = await TripService.archiveTrip(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: trip });
  } catch (error) {
    next(error);
  }
};
