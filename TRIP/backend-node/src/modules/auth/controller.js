import { AuthService } from './service.js';
import { logger } from '../../utils/logger.js';

export const syncUser = async (req, res, next) => {
  try {
    const firebaseUser = req.user; // Set by requireAuth middleware
    
    // We pass the decoded token which contains uid, email, name, picture
    const userProfile = await AuthService.syncFirebaseUser(firebaseUser);
    
    res.status(200).json({
      status: 'success',
      data: userProfile
    });
  } catch (error) {
    logger.error('Error in syncUser controller:', error);
    next(error);
  }
};
