import { AuthRepository } from './repository.js';
import { logger } from '../../utils/logger.js';

export class AuthService {
  static async syncUser(authUser) {
    const { uid, email, user_metadata } = authUser;
    const name = user_metadata?.name || '';
    const picture = user_metadata?.avatar_url || '';
    
    // Check if user exists in Database
    let user = await AuthRepository.getById(uid);
    
    if (!user) {
      // Create new user profile
      logger.info(`Creating new user profile for ${uid}`);
      user = await AuthRepository.create(uid, {
        email,
        name: name || '',
        picture: picture || '',
        preferences: {
          currency: 'INR',
          language: 'en'
        }
      });
    } else {
      // Optionally update last login
      logger.info(`Syncing existing user profile for ${uid}`);
      user = await AuthRepository.update(uid, {
        lastLoginAt: new Date().toISOString()
      });
    }
    
    return user;
  }
}
