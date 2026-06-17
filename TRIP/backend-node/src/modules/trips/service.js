import { TripRepository } from './repository.js';
import { logger } from '../../utils/logger.js';

export class TripService {
  static async createTrip(userId, data) {
    const tripData = {
      ...data,
      userId,
      isShared: false,
      version: 1,
      metadata: {
        lastEditedBy: userId,
        platform: 'web'
      },
      statistics: {
        totalDays: this.calculateDays(data.startDate, data.endDate),
        estimatedCost: 0
      }
    };
    return await TripRepository.create(null, tripData);
  }

  static async getTrips(userId) {
    return await TripRepository.getTripsByUser(userId);
  }

  static async getTripById(userId, tripId) {
    const trip = await TripRepository.getById(tripId);
    if (!trip || trip.userId !== userId) {
      const error = new Error('Trip not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }
    return trip;
  }

  static async updateTrip(userId, tripId, data) {
    const trip = await this.getTripById(userId, tripId);
    
    // Bump version and update metadata
    const updatedData = {
      ...data,
      version: trip.version + 1,
      'metadata.lastEditedBy': userId
    };

    if (data.startDate || data.endDate) {
      const start = data.startDate || trip.startDate;
      const end = data.endDate || trip.endDate;
      updatedData['statistics.totalDays'] = this.calculateDays(start, end);
    }

    return await TripRepository.update(tripId, updatedData);
  }

  static async deleteTrip(userId, tripId) {
    await this.getTripById(userId, tripId); // Verify ownership
    return await TripRepository.delete(tripId);
  }

  static async archiveTrip(userId, tripId) {
    return await this.updateTrip(userId, tripId, { status: 'archived' });
  }

  static async duplicateTrip(userId, tripId) {
    const originalTrip = await this.getTripById(userId, tripId);
    
    const { id, createdAt, updatedAt, version, ...duplicateData } = originalTrip;
    
    duplicateData.destination = `Copy of ${originalTrip.destination}`;
    duplicateData.status = 'planning';
    
    return await this.createTrip(userId, duplicateData);
  }

  static calculateDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive days
  }
}
