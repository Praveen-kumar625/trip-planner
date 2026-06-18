import { AuthRepository } from './repository.js';
import { logger } from '../../utils/logger.js';
import { firebaseAdmin } from '../../config/firebase.js';

export class AuthService {
  static async syncFirebaseUser(firebaseUser) {
    const { uid, email, name, picture } = firebaseUser;
    
    // Check if user exists in Firestore
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
      // Optionally update last login or sync updated details from Firebase
      logger.info(`Syncing existing user profile for ${uid}`);
      user = await AuthRepository.update(uid, {
        lastLoginAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return user;
  }
}
