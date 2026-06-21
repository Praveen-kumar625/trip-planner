import { AuthService } from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const syncUser = catchAsync(async (req, res) => {
  const user = req.user; // Set by requireAuth middleware
  
  // We pass the user object from Supabase auth
  const userProfile = await AuthService.syncUser(user);
  
  res.status(200).json({
    status: 'success',
    data: userProfile
  });
});
