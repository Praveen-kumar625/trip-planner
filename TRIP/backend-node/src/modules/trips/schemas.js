import { z } from 'zod';

export const createTripSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  destinationId: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budgetLevel: z.enum(['cheap', 'moderate', 'luxury']).default('moderate'),
  travelers: z.number().int().min(1).default(1),
  preferences: z.array(z.string()).optional().default([]),
  status: z.enum(['planning', 'upcoming', 'active', 'completed', 'archived']).default('planning')
});

export const updateTripSchema = createTripSchema.partial();
