import { AnalyticsService } from './service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await AnalyticsService.getDashboardStats(req.user.uid);
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};

export const getTripAnalytics = async (req, res, next) => {
  try {
    const stats = await AnalyticsService.getTripAnalytics(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};
