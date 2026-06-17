import { NotificationService } from './service.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getNotifications(req.user.uid);
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAsRead(req.user.uid, req.params.id);
    res.status(200).json({ status: 'success', message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};
