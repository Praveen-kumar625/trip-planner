import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { searchPlaces, getPlaceDetails, autocomplete } from './controller.js';

const router = Router();
router.use(requireAuth);

router.get('/search', searchPlaces);
router.get('/autocomplete', autocomplete);
router.get('/place/:placeId', getPlaceDetails);

export default router;
