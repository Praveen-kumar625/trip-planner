import { NotificationService } from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await NotificationService.getNotifications(req.user.uid);
  res.status(200).json({ status: 'success', data: notifications });
});

export const markAsRead = catchAsync(async (req, res, next) => {
  await NotificationService.markAsRead(req.user.uid, req.params.id);
  res.status(200).json({ status: 'success', message: 'Notification marked as read' });
});
