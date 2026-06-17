import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  dietary: z.array(z.string()).optional(),
  seating: z.enum(['aisle', 'window', 'any']).optional(),
  budgetLevel: z.enum(['cheap', 'moderate', 'luxury']).optional(),
  accessibility: z.array(z.string()).optional(),
  favoriteAirlines: z.array(z.string()).optional(),
  preferredActivities: z.array(z.string()).optional(),
  implicitContext: z.record(z.string(), z.any()).optional() // For AI to store implicit learned preferences
});
