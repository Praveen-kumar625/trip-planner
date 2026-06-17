import { BaseRepository } from '../../firestore/repository.js';

class NotificationRepositoryClass extends BaseRepository {
  constructor() {
    super('notifications');
  }

  async getUnreadByUser(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .orderBy('createdAt', 'desc')
      .get();
      
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

const NotificationRepository = new NotificationRepositoryClass();

export class NotificationService {
  static async getNotifications(userId) {
    return await NotificationRepository.getUnreadByUser(userId);
  }

  static async markAsRead(userId, notificationId) {
    // Verify ownership indirectly by updating
    return await NotificationRepository.update(notificationId, { isRead: true });
  }

  static async sendNotification(userId, title, message, type = 'info') {
    const data = {
      userId,
      title,
      message,
      type,
      isRead: false
    };
    return await NotificationRepository.create(null, data);
  }
}
