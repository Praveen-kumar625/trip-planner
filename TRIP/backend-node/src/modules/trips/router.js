import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { 
  createTrip, 
  getTrips, 
  getTripDetails, 
  updateTrip, 
  deleteTrip, 
  duplicateTrip, 
  archiveTrip 
} from './controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getTrips);
router.get('/:tripId', getTripDetails);
router.post('/', createTrip);
router.patch('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);
router.post('/:tripId/duplicate', duplicateTrip);
router.post('/:tripId/archive', archiveTrip);

export default router;
