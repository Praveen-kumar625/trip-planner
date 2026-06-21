import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw error || new Error('User not found');
    }
    // Set req.user to match expected structure (uid instead of id if needed, but Supabase uses id)
    // We'll expose uid to maintain compatibility with existing backend code if it uses req.user.uid
    req.user = { ...user, uid: user.id };
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
