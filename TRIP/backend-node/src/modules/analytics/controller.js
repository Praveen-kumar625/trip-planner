import { AnalyticsService } from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await AnalyticsService.getDashboardStats(req.user.uid);
  res.status(200).json({ status: 'success', data: stats });
});

export const getTripAnalytics = catchAsync(async (req, res) => {
  const stats = await AnalyticsService.getTripAnalytics(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: stats });
});
