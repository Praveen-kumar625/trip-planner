import { PreferencesService } from './service.js';
import { updatePreferencesSchema } from './schemas.js';

export const getPreferences = async (req, res, next) => {
  try {
    const prefs = await PreferencesService.getPreferences(req.user.uid);
    res.status(200).json({ status: 'success', data: prefs });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const validatedData = updatePreferencesSchema.parse(req.body);
    const prefs = await PreferencesService.updatePreferences(req.user.uid, validatedData);
    res.status(200).json({ status: 'success', data: prefs });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

export const deletePreferenceItem = async (req, res, next) => {
  try {
    const prefs = await PreferencesService.deletePreference(req.user.uid, req.params.key);
    res.status(200).json({ status: 'success', data: prefs });
  } catch (error) {
    next(error);
  }
};
