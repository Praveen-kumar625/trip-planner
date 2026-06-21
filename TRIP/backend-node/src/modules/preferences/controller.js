import { PreferencesService } from './service.js';
import { updatePreferencesSchema } from './schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getPreferences = catchAsync(async (req, res, next) => {
  const prefs = await PreferencesService.getPreferences(req.user.uid);
  res.status(200).json({ status: 'success', data: prefs });
});

export const updatePreferences = catchAsync(async (req, res, next) => {
  const validatedData = updatePreferencesSchema.parse(req.body);
  const prefs = await PreferencesService.updatePreferences(req.user.uid, validatedData);
  res.status(200).json({ status: 'success', data: prefs });
});

export const deletePreferenceItem = catchAsync(async (req, res, next) => {
  const prefs = await PreferencesService.deletePreference(req.user.uid, req.params.key);
  res.status(200).json({ status: 'success', data: prefs });
});
