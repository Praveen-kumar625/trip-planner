import { z } from 'zod';

export const expenseCategories = [
  'Flights', 'Hotels', 'Food', 'Transport', 'Shopping', 
  'Activities', 'Insurance', 'Visa', 'Emergency', 'Miscellaneous'
];

export const createExpenseSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  amount: z.number().positive(),
  currency: z.string().length(3).default('INR'),
  category: z.enum(expenseCategories),
  description: z.string().optional(),
  date: z.string().datetime(),
  receiptUrl: z.string().url().optional()
});

export const updateExpenseSchema = createExpenseSchema.partial().omit({ tripId: true });
