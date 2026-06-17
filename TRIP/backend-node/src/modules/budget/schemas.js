import { z } from 'zod';

export const createBudgetSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  totalAmount: z.number().positive(),
  currency: z.string().length(3).default('INR'),
  categories: z.record(z.string(), z.number().positive()).optional() // e.g. { flights: 50000, hotels: 30000 }
});

export const updateBudgetSchema = z.object({
  totalAmount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  categories: z.record(z.string(), z.number().positive()).optional()
});
